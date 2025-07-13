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

    await connection.connect(workspace_id, tab_id, websocket)
    try:
        while True:
            print("************* in while **************")
            raw_data = await websocket.receive_text()
            print("************* raw_data **************")
            # print(raw_data)
            data = json.loads(raw_data)
            sender_id = (data.get("sender_id"))
            content = data.get("content")
            # 추가
            file_data = data.get("file_url")


            workspace_member = workspace_member_service.get_member_by_user_id(uuid.UUID(sender_id).bytes)
            # 가져온 workspace_member data
            # [0]: wm.user_id
            # [1]: wm.workspace_id
            # [2]: wm.nickname
            # [3]: wm.email
            # [4]: wm.image
            # [5]: r.name AS role
            # [6]: GROUP_CONCAT(DISTINCT g.name)
            # [7]: wm.github
            # [8]: wm.blog
            
            nickname = workspace_member[0][2]
            image = workspace_member[0][4]

            message_id = await message_service.save_message(tab_id, sender_id, content, file_data)
            print("message_id: ", message_id)

            payload = {
                "file_url": file_data, # file_url 보내주기.
                "content": content,
                "nickname": nickname,
                "image": image,
                "createdAt": str(datetime.now().isoformat()),    # 하드코딩으로 진행, 나중에 수정해주세요
                "message_id": message_id,
                "sender_id": sender_id
            }
            # print(payload)

            
            # file_data_with_msg_id = {
            #     "message_id": message_id,
            #     "file_url": file_data
            # }
            # if file_data != None:
            #     await message_service.save_file_to_db(file_data_with_msg_id)
            await connection.broadcast(workspace_id, tab_id, json.dumps(payload))
    
    except WebSocketDisconnect:
        print("********* except *********")
        # await connection.broadcast(workspace_id, tab_id, f"#{nickname}님이 나갔습니다.")
        connection.disconnect(workspace_id, tab_id, websocket)
