import ws from 'k6/ws';
import { check, sleep } from 'k6';
import { Counter, Trend } from 'k6/metrics';

// ── 옵션 ─────────────────────────────────────────────────────────
export const options = {
  scenarios: {
    cps: {
      executor: 'ramping-arrival-rate',
      startVUs: 50,         // 초반 50명
      stages: [
        { duration: '1m', target: 200 }, // 1분 동안 200명까지 증가
        { duration: '1m', target: 400 }, // 1분 동안 400명까지 증가
        { duration: '1m', target: 400 }, // 1분 동안 400명 유지
        { duration: '1m', target: 0 },   // 종료 시점에서 천천히 줄이기
      ],
      gracefulRampDown: '30s',
    },
  },
};

// ── 대상/주기 설정 ───────────────────────────────────────────────
const URL = __ENV.WS_URL || 'wss://polaryx.net/api/ws/1/1';
const SEND_MS = __ENV.SEND_MS ? parseInt(__ENV.SEND_MS) : 1000;
const HOLD_SEC = __ENV.HOLD_SEC ? parseInt(__ENV.HOLD_SEC) : 30;

// ── KPI 메트릭 ───────────────────────────────────────────────────
const connects  = new Counter('ws_connect_total');     // 성공한 연결 수(denominator)
const msgs_out  = new Counter('ws_msg_out_total');
const msgs_in   = new Counter('ws_msg_in_total');
const err_total = new Counter('ws_error_total');       // 에러 건수(numerator)
const connectP  = new Trend('connect_latency', true);  // ms
const rtP       = new Trend('rt_latency', true);       // ms

// ── 테스트 본문 ───────────────────────────────────────────────────
export default function () {
  const t0 = Date.now();

  const res = ws.connect(URL, {}, (socket) => {
    socket.on('open', () => {
      connects.add(1);
      connectP.add(Date.now() - t0);

      // ping 전송 (서버가 같은 포맷으로 응답해줄 때 RT 측정)
      const tick = () => {
        const sentAt = Date.now();
        const payload = `pong|${sentAt}|${__VU}|${__ITER}`;
        socket.send(payload);
        msgs_out.add(1);
      };
      tick();
      socket.setInterval(tick, SEND_MS);

      socket.on('message', (data) => {
        const parts = String(data).split('|');
        const tSent = parseInt(parts[1], 10);
        if (!Number.isNaN(tSent)) rtP.add(Date.now() - tSent);
        msgs_in.add(1);
      });

      socket.on('error', () => err_total.add(1));
      socket.setTimeout(() => socket.close(), HOLD_SEC * 1000);
    });
  });

  check(res, { 'status is 101': (r) => r && r.status === 101 });
  sleep(1);
}

// ── 요약 출력(연결 기준 에러율) ────────────────────────────────────
// 주의: 분모는 "성공한 연결 수(connects)" 입니다.
export function handleSummary(data) {
  const durSec = data.state.testRunDurationMs / 1000;
  const v = (name) => data.metrics[name];
  const sum = (m) => m?.values?.sum ?? 0;
  const p = (m, k) => m?.values?.[k];

  const connTotal = sum(v('ws_connect_total'));
  const errTotal  = sum(v('ws_error_total'));
  const mOutTotal = sum(v('ws_msg_out_total'));
  const mInTotal  = sum(v('ws_msg_in_total'));

  const cps    = connTotal / durSec;
  const mpsOut = mOutTotal / durSec;
  const mpsIn  = mInTotal / durSec;
  const p95Conn = p(v('connect_latency'), 'p(95)');
  const p95RT   = p(v('rt_latency'), 'p(95)');

  const errRateConn = connTotal ? (errTotal / connTotal) : 0; // per successful connection

  const lines = [
    '=== k6 WebSocket KPI ===',
    `CPS (connections/s): ${cps.toFixed(2)}`,
    `MPS_out (msgs/s):    ${mpsOut.toFixed(2)}`,
    `MPS_in  (msgs/s):    ${mpsIn.toFixed(2)}`,
    `connect p95 (ms):    ${p95Conn?.toFixed(2) ?? 'n/a'}`,
    `round-trip p95 (ms): ${p95RT?.toFixed(2) ?? 'n/a'}`,
    `error rate (per conn): ${(errRateConn * 100).toFixed(2)}%`,
    `errors/conn: ${connTotal ? (errTotal / connTotal).toFixed(4) : '0.0000'}  (total ${errTotal})`,
  ];
  return { stdout: '\n' + lines.join('\n') + '\n', 'summary.json': JSON.stringify(data) };
}

