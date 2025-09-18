import ws from 'k6/ws';
import { check } from 'k6';

const TARGET = Number(__ENV.TARGET || 1200);
const HOLD_MS = Number(__ENV.HOLD_MS || 80000); // 스테이지(30+45+15=90s)보다 약간 짧거나 길게

export const options = {
  scenarios: {
    ws: {
      executor: 'per-vu-iterations',
      vus: TARGET,
      iterations: 1,
      maxDuration: '120s',
      gracefulStop: '0s',
    },
  },
  thresholds: {
    checks: ['rate>=0.99'],
    'vus_max': [`value>=${TARGET}`],
    'ws_sessions{scenario:ws}': [`count>=${TARGET}`],
    'ws_connecting': ['p(95)<2000'],
  },
};

export default function () {
  const res = ws.connect('wss://polaryx.net/api/ws/1/1', {}, (socket) => {
    socket.setTimeout(() => socket.close(), HOLD_MS); // 테스트 내내 1회만 유지
  });
  check(res, { 'status is 101': (r) => r && r.status === 101 });
}