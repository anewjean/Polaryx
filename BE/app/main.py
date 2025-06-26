from fastapi import FastAPI, Cookie, Depends, Query, WebSocket, WebSocketException, WebSocketDisconnect, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from websocket_manager import ConnectionManager
from typing import Annotated

app = FastAPI()
connection_manager = ConnectionManager()

app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"], # 개발용 
    allow_origins=["http://43.201.21.169:3000"], # 배포용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ping")
async def pong():
    return {"message": "pong from backend"}

html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <h2>Your ID: <span id="ws-id"></span></h2>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var client_id = Date.now()
            var channel_id = 'test1'
            document.querySelector("#ws-id").textContent = client_id;
            var ws = new WebSocket(`ws://localhost:8000/ws/${client_id}?channel_id=${channel_id}`);
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""

@app.get("/")
async def get():
    return HTMLResponse(html)

async def get_cookie_or_token(
    websocket: WebSocket,
    session: Annotated[str | None, Cookie()] = None, 
    token: Annotated[str | None, Query()] = None,
): 
    if not session and token is None:
        raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION)
    return session or token

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(
    websocket: WebSocket, 
    channel_id: str,
    client_id: int,
):
    await connection_manager.connect(channel_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await connection_manager.broadcast(channel_id, f"Client #{client_id}: {data}")
    except WebSocketDisconnect:
        connection_manager.disconnect(channel_id, websocket)
        await connection_manager.broadcast(channel_id, f"#{client_id}님이 나갔습니다.")


# 채팅방 생성

# 내 채팅방 목록 조회

# 채팅방 상세 조회(채팅방 띄우기)

# 메시지 목록 조회

# 메시지 전송
