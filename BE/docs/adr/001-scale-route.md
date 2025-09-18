# ADR 001: 실시간 경로 스케일아웃

- Status: Accepted (2025-09-02)
- Context: 1000+ CCU, 기존 경로는 고부하에서 연결 성공률 저하(64.9% @1200 VU 3분)
- Decision: 신규 경로(polaryx.net)로 분리 및 수평 확장 고정, Redis Pub/Sub 동기화 유지
- Alternatives: 단일 경로 증설, in-memory fan-out, Kafka 도입
- Consequences: 연결 안정성 100% @1200 VU 3분, 연결 p95 9.79s(기존 55.1s)로 개선. 운영 경로 이원화 관리 필요
- Evidence: BE/performance-tests/polaryx-hold.json, jungle-hold.json 