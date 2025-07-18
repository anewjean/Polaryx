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
#############################################################
# 1. ConnectionManager를 두 개 생성합니다.
message_connection = ConnectionManager()
like_connection = ConnectionManager()
#############################################################

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

    #############################################################
    # 2. 메시지용 매니저를 사용합니다.
    await message_connection.connect(workspace_id, tab_id, websocket)
    #############################################################
    try:
        while True:
            print("************* in while **************")
            raw_data = await websocket.receive_text()
            print("************* raw_data **************")
            # print(raw_data)
            data = json.loads(raw_data)
            sender_id = (data.get("sender_id"))
            content = data.get("content")
            print("content: ", content)
            # 추가
            file_data = data.get("file_url")
            print("file_url: ", file_data)
            
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
            #############################################################
            await message_connection.broadcast(workspace_id, tab_id, json.dumps(payload))
            #############################################################
            
            members = tab_service.get_tab_members(workspace_id, tab_id)
            tab_info = tab_service.find_tab(workspace_id, tab_id)
            tab_name = tab_info[0][1]
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
                "title": tab_name,
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
        #############################################################
        print("********* Message websocket disconnected *********")
        # 4. 연결 해제도 메시지용 매니저로 합니다.
        message_connection.disconnect(workspace_id, tab_id, websocket)
        #############################################################

@router.websocket("/like/{workspace_id}/{tab_id}")
async def websocket_endpoint_like(websocket: WebSocket, workspace_id: int, tab_id: int):
    print("************* ws like endpoint ****************")

    # 5. '좋아요'는 like_connection 매니저를 사용합니다.
    await like_connection.connect(workspace_id, tab_id, websocket)
    try:
        while True:
            print("********* like in while **********")
            raw_data = await websocket.receive_text()
            data = json.loads(raw_data)
            print(f"\n\n\nLike data received: {data}")

            user_id = data["userId"]
            message_id = data["messageId"]
            action = data["action"] == "like"

            if not user_id or not message_id:
                print(f"Invalid like data received: {data}")
                continue

            # 2. '좋아요' 토글 서비스 로직 호출
            # 이 서비스는 내부에 '좋아요' 추가/삭제 및 like_count 업데이트 로직을 포함하고,
            updated_like_count = await message_service.toggle_like(tab_id, message_id, user_id, action)

            # 3. 브로드캐스트할 페이로드(payload) 생성
            # 프론트엔드가 받을 데이터 형식이므로 camelCase로 맞춰줍니다.
            payload = {
                "type": "like",
                "messageId": message_id,
                "likeCount": updated_like_count
            }

            print(f"Broadcasting like update: {payload}")

            # 6. 브로드캐스트도 '좋아요'용 매니저로 합니다.
            await like_connection.broadcast(workspace_id, tab_id, json.dumps(payload))

    except WebSocketDisconnect:
        print("********* Like websocket disconnected *********")
        # 7. 연결 해제도 '좋아요'용 매니저로 합니다.
        like_connection.disconnect(workspace_id, tab_id, websocket)
    except Exception as e:
        print(f"An error occurred in like websocket: {e}")
        like_connection.disconnect(workspace_id, tab_id, websocket)
