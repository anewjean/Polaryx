import json
from fastapi import WebSocket, WebSocketDisconnect
from fastapi import APIRouter
from datetime import datetime
import pytz

from app.service.websocket_manager import ConnectionManager
from app.service.message import MessageService
from app.service.workspace_member import WorkspaceMemberService

from app.service.push import PushService
from app.service.tab import TabService

from app.service.notification import NotificationService
from app.router.sse import send_sse_notification

import uuid
import re

router = APIRouter()
connection = ConnectionManager()
message_service = MessageService()
workspace_member_service = WorkspaceMemberService()

tab_service = TabService()
push_service = PushService()
notification_service = NotificationService()


# HTML 태그 제거 함수
def strip_tags(text: str) -> str:
    return re.sub(r'<[^>]+>', '', text)



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
            print(file_data)
            
            clean_content = strip_tags(content)


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
                "created_at": str(datetime.now(pytz.timezone("Asia/Seoul")).isoformat()),    # 하드코딩으로 진행, 나중에 수정해주세요
                "message_id": message_id,
                "sender_id": sender_id
            }
            # SSE 알림 전송
            await send_sse_notification(
                str(workspace_id),
                {
                "type": "new_message",
                "tab_id": tab_id,
                "content": content,
                "nickname": nickname,
                "image": image,
                "message_id": message_id,
                "sender_id": sender_id
                }
            )
            # print(payload)

            
            # file_data_with_msg_id = {
            #     "message_id": message_id,
            #     "file_url": file_data
            # }
            # if file_data != None:
            #     await message_service.save_file_to_db(file_data_with_msg_id)
            await connection.broadcast(workspace_id, tab_id, json.dumps(payload))
            
            members = await tab_service.get_tab_members(workspace_id, tab_id)
            #members = workspace_member_service.get_members_by_workspace_id(workspace_id)
            # recipients = [str(uuid.UUID(bytes=row[0])) #자신 제외
            #               for row in members
            #               if row[0] != uuid.UUID(sender_id).bytes
            #               ]
            sender_uuid = uuid.UUID(sender_id)
            recipients = [
            str(uuid.UUID(bytes=row[0]))
            for row in members
            if uuid.UUID(bytes=row[0]) != sender_uuid
             ]

            print("보내는 uuid", sender_id)
            print("푸시 아이디", recipients)
            
            #recipients = [str(uuid.UUID(bytes=row[0])) for row in members] #자신 포함 
            await push_service.send_push_to(recipients, {
                "title": "New Message",
                "body": f"{nickname}: {clean_content}",
                "url": f"/workspaces/{workspace_id}/tabs/{tab_id}"
            })

            for receiver in recipients:
                await notification_service.create_notification(
                    receiver_id= receiver,
                    sender_id=sender_id,
                    tab_id=tab_id,
                    message_id=message_id,
                    type=1,
                    content=clean_content,
                )
    except WebSocketDisconnect:
        print("********* except *********")
        # await connection.broadcast(workspace_id, tab_id, f"#{nickname}님이 나갔습니다.")
        connection.disconnect(workspace_id, tab_id, websocket)
