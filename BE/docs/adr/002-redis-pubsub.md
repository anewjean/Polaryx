# ADR 002: 브로드캐스트 동기화에 Redis Pub/Sub 채택

- Status: Accepted (2025-09-02)
- Context: 다중 WS 인스턴스 간 메시지 동기화 필요, 낮은 지연/간단 운영 요구
- Decision: Redis Pub/Sub 채택. WS 서버는 구독, 발신은 publish
- Alternatives: DB 트리거, Kafka(영속·파티셔닝), ZeroMQ 등
- Consequences: 낮은 지연/간단 운영 장점. 영속성 없음 → 필요 시 DLQ/재생은 별도 구성
- Evidence: 스모크/스텝/홀드 테스트에서 RX/TX≈97–100% 유지, 운영 단순성 