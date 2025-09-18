import ws from 'k6/ws';
import { check } from 'k6';

export const options = {
    scenarios: {
      ws: {
        executor: 'per-vu-iterations',
        vus: 20,
        iterations: 1,
        maxDuration: '60s',     // 핸드셰이크/지연 여유
        gracefulStop: '0s',
      },
    },
    thresholds: {
      'checks': ['rate==1'],
      'vus_max': ['value>=20'],            // 동시성 보장
      'ws_sessions': ['count==20'],  // 누적 세션 == VU 수
      'ws_connecting': ['p(95)<500'],
    },
  };

export default function () {
  const url = 'wss://jungle-lms.site/api/ws/1/1';
  const res = ws.connect(url, {}, (socket) => {
    socket.setTimeout(() => socket.close(), 30000); // 테스트 시간과 맞춤
  });

  check(res, { 'status is 101': (r) => r && r.status === 101 });
}