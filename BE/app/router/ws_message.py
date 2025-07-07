import json
from fastapi import WebSocket, WebSocketDisconnect
from fastapi import APIRouter
from datetime import datetime

from app.service.websocket_manager import ConnectionManager
from app.service.message import MessageService
from app.service.workspace_member import WorkspaceMemberService

import uuid

router = APIRouter()
connection = ConnectionManager()
message_service = MessageService()
workspace_member_service = WorkspaceMemberService()


@router.websocket("/{workspace_id}/{tab_id}")
async def websocket_endpoint(websocket: WebSocket, workspace_id: int, tab_id: int):
    workspace_member = None
    print("******************* ws endpoint *******************")
    print(tab_id)

    await connection.connect(workspace_id, tab_id, websocket)
    try:
        while True:
            print("************* in while **************")
            raw_data = await websocket.receive_text()
            print("************* raw_data **************")
            print(raw_data)
            data = json.loads(raw_data)
            print(data)
            sender_id = (data.get("sender_id"))
            print(sender_id)
            content = data.get("content")
            print(content)

            workspace_member = workspace_member_service.get_member_by_user_id(uuid.UUID(sender_id).bytes)
            print(workspace_member)
            nickname = workspace_member[0][3]
            print(nickname)
            image = workspace_member[0][5]
            print(image)

            payload = {
                # "message_id": , # message id 보내주기.
                "content": content,
                "nickname": nickname,
                "image": image,
                "created_at": str(datetime.now().isoformat()),    # 하드코딩으로 진행, 추후 수정 요망
            }
            print(payload)

            await connection.broadcast(workspace_id, tab_id, json.dumps(payload))
            await message_service.save_message(tab_id, sender_id, content)
    except WebSocketDisconnect:
        print("********* except *********")
        connection.disconnect(workspace_id, tab_id, websocket)
        await connection.broadcast(workspace_id, tab_id, f"#{nickname}님이 나갔습니다.")
