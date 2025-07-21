import json
import uuid
import asyncio
from fastapi import WebSocket
from typing import Dict, List, Optional
from app.util.database.redis import RedisManager


class ConnectionManager:
    def __init__(self):
        self.activate_connections: Dict[int, Dict[int, List[WebSocket]]] = {}
        self.server_id = uuid.uuid4().hex[:8]  # 서버 고유 ID
        self._redis_client: Optional = None
        self._pubsub_client: Optional = None
        self._pubsub_task: Optional[asyncio.Task] = None
        self._is_listening = False
    
    async def _get_redis_client(self):
        """Redis 클라이언트 lazy 초기화"""
        if self._redis_client is None:
            self._redis_client = await RedisManager.get_redis()
        return self._redis_client
    
    async def _get_pubsub_client(self):
        """Pub/Sub 클라이언트 lazy 초기화"""
        if self._pubsub_client is None:
            self._pubsub_client = await RedisManager.get_pubsub_redis()
        return self._pubsub_client
    
    async def connect(self, workspace_id: int, tab_id: int, websocket: WebSocket):
        await websocket.accept()
        
        if workspace_id not in self.activate_connections:
            self.activate_connections[workspace_id] = {}
        if tab_id not in self.activate_connections[workspace_id]:
            self.activate_connections[workspace_id][tab_id] = []
        
        self.activate_connections[workspace_id][tab_id].append(websocket)

        # Redis에 서버별 연결 정보 저장
        await self._update_redis_connection_info(workspace_id, tab_id, 'connect')

        if not self._is_listening:
            await self._start_redis_listener()
    
    async def disconnect(self, workspace_id: int, tab_id: int, websocket: WebSocket):
        try:
            tab_connections = self.activate_connections.get(workspace_id, {}).get(tab_id)
            if tab_connections and websocket in tab_connections:
                tab_connections.remove(websocket)

                # 탭 내 소켓이 모두 비어있으면 탭 삭제
                if not tab_connections:
                    del self.activate_connections[workspace_id][tab_id]

                # 워크스페이스 내 탭이 모두 없어졌으면 워크스페이스 삭제
                if not self.activate_connections[workspace_id]:
                    del self.activate_connections[workspace_id]
                
                # Redis에 서버별 연결 정보 업데이트
                await self._update_redis_connection_info(workspace_id, tab_id, 'disconnect')
            
        except Exception as e:
            print(f"소켓 연결 해제 에러가 발생했습니다 :: {e}")
            pass

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)
    
    async def broadcast_local(self, workspace_id: int, tab_id: int, message: str):
        """로컬 서버의 연결된 클라이언트들에게만 브로드캐스트"""
        connections = self.activate_connections.get(workspace_id, {}).get(tab_id, [])
        for connection in connections[:]:
            try:
                await connection.send_text(message)
            except Exception:
                connections.remove(connection)
    
    async def broadcast(self, workspace_id: int, tab_id: int, message: str):
        """로컬 브로드캐스트 + Redis를 통한 다른 서버 브로드캐스트"""
        # 로컬 연결된 클라이언트들에게 즉시 전송
        await self.broadcast_local(workspace_id, tab_id, message)
        
        # Redis를 통해 다른 서버들에게 알림
        try:
            redis_client = await self._get_redis_client()
            channel = f"workspace:{workspace_id}:tab:{tab_id}"
            redis_message = {
                "message": message,
                "sender_server": self.server_id,
                "timestamp": asyncio.get_event_loop().time()
            }
            await redis_client.publish(channel, json.dumps(redis_message))
        except Exception as e:
            print(f"Redis publish 에러: {e}")
            # Redis 에러가 있어도 로컬 브로드캐스트는 성공했으므로 계속 진행
    
    async def _start_redis_listener(self):
        """Redis Pub/Sub 리스너 시작"""
        if self._is_listening:
            return
            
        try:
            self._is_listening = True
            self._pubsub_task = asyncio.create_task(self._redis_listener())
        except Exception as e:
            print(f"Redis 리스너 시작 에러: {e}")
            self._is_listening = False
    
    async def _redis_listener(self):
        """Redis 메시지 수신 및 처리"""
        try:
            pubsub_client = await self._get_pubsub_client()
            pubsub = pubsub_client.pubsub()

            # 모든 워크스페이스:탭 채널 구독
            await pubsub.psubscribe("workspace:*:tab:*")

            async for message in pubsub.listen():
                if message["type"] == "pmessage":
                    await self._handle_redis_message(message)

        except Exception as e:
            print(f"Redis 리스너 에러: {e}")
        finally:
            self._is_listening = False
    
    async def _handle_redis_message(self, redis_message):
        """Redis에서 받은 메시지 처리"""
        try:
            channel = redis_message["channel"]
            data = json.loads(redis_message["data"])
            
            # 자신이 보낸 메시지는 무시
            if data.get("sender_server") == self.server_id:
                return
            
            # 채널에서 workspace_id, tab_id 추출
            # 형식: workspace:123:tab:456
            parts = channel.split(":")
            if len(parts) >= 4:
                workspace_id = int(parts[1])
                tab_id = int(parts[3])
                message = data.get("message", "")
                
                # 로컬 연결된 클라이언트들에게 브로드캐스트
                await self.broadcast_local(workspace_id, tab_id, message)
                
        except Exception as e:
            print(f"Redis 메시지 처리 에러: {e}")
    
    async def cleanup(self):
        """리소스 정리"""
        if self._pubsub_task:
            self._pubsub_task.cancel()
            try:
                await self._pubsub_task
            except asyncio.CancelledError:
                pass
        
        await RedisManager.close_connections()
    
    async def _update_redis_connection_info(self, workspace_id: int, tab_id: int, action: str):
        """Redis에 서버별 연결 정보 업데이트"""
        try:
            redis_client = await self._get_redis_client()
            key = f"workspace:{workspace_id}:tab:{tab_id}:connections"
            
            # 현재 서버의 연결 수 계산
            current_connections = len(self.activate_connections.get(workspace_id, {}).get(tab_id, []))
            
            if current_connections > 0:
                # 서버별 연결 수 저장 (Hash 사용)
                await redis_client.hset(key, self.server_id, current_connections)
                # TTL 설정 (1시간)
                await redis_client.expire(key, 3600)
            else:
                # 연결이 없으면 해당 서버 정보 삭제
                await redis_client.hdel(key, self.server_id)
                
        except Exception as e:
            print(f"Redis 연결 정보 업데이트 에러: {e}")
    
    async def get_total_connections(self, workspace_id: int, tab_id: int) -> int:
        """특정 워크스페이스:탭의 전체 연결 수 조회"""
        try:
            redis_client = await self._get_redis_client()
            key = f"workspace:{workspace_id}:tab:{tab_id}:connections"
            
            # 모든 서버의 연결 수 합계
            server_connections = await redis_client.hgetall(key)
            total = sum(int(count) for count in server_connections.values())
            
            return total
        except Exception as e:
            print(f"Redis 연결 정보 조회 에러: {e}")
            return 0
    
    async def get_server_connections(self, workspace_id: int, tab_id: int) -> Dict[str, int]:
        """특정 워크스페이스:탭의 서버별 연결 수 조회"""
        try:
            redis_client = await self._get_redis_client()
            key = f"workspace:{workspace_id}:tab:{tab_id}:connections"
            
            server_connections = await redis_client.hgetall(key)
            return {server_id: int(count) for server_id, count in server_connections.items()}
        except Exception as e:
            print(f"Redis 서버별 연결 정보 조회 에러: {e}")
            return {}