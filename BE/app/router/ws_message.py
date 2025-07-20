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

message_connection = ConnectionManager()
like_connection = ConnectionManager()
profile_connection = ConnectionManager()

message_service = MessageService()
workspace_member_service = WorkspaceMemberService()

tab_service = TabService()
push_service = PushService()
notification_service = NotificationService()


# HTML 태그 제거 함수
def strip_tags(text: str) -> str:
    return re.sub(r'<[^>]+>', '', text)

# 이미지 파일인지 확인하는 함수
def check_file_type(file_url: str) -> str:
    if not file_url:
        return "none"
    
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg']
    if any(file_url.lower().endswith(ext) for ext in image_extensions):
        return "image"
    else:
        return "file"

# 알림 메시지 생성 함수
def create_push_message(nickname: str, content: str, file_url: str) -> str:
    file_type = check_file_type(file_url)
    if file_type == "image":
        return f"{nickname}: 사진이 첨부되었습니다"
    elif file_type == "file":
        return f"{nickname}: 파일이 첨부되었습니다"
    else:
        clean_content = strip_tags(content)
        return f"{nickname}: {clean_content}"


@router.websocket("/{workspace_id}/{tab_id}")
async def websocket_endpoint(websocket: WebSocket, workspace_id: int, tab_id: int):
    workspace_member = None
    await message_connection.connect(workspace_id, tab_id, websocket)

    try:
        while True:
            print("************* in ws endpoint, while **************")
            raw_data = await websocket.receive_text()

            data = json.loads(raw_data)
            type = data.get("type")
            if type == "send":
                sender_id = (data.get("sender_id"))
                content = data.get("content")
                file_data = data.get("file_url")
                
                clean_content = strip_tags(content)

                workspace_member = workspace_member_service.get_member_by_user_id(uuid.UUID(sender_id).bytes)
                
                nickname = workspace_member[0][2]
                image = workspace_member[0][4]

                message_id = await message_service.save_message(tab_id, sender_id, content, file_data)

                payload = {
                    "type": "send",
                    "file_url": file_data,
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

                await message_connection.broadcast(workspace_id, tab_id, json.dumps(payload))
                
                members = tab_service.get_tab_members(workspace_id, tab_id)
                tab_info = tab_service.find_tab(workspace_id, tab_id)
                tab_name = tab_info[0][1]
                
                sender_uuid = uuid.UUID(sender_id)
                recipients = [
                str(uuid.UUID(bytes=row[0]))
                for row in members
                if uuid.UUID(bytes=row[0]) != sender_uuid
                ]

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
            else:  # 수정한 메세지 broadcast
                message_id = (data.get("msg_id"))
                content = data.get("content")
                print("content: ", content)
                print("message_id: ", message_id)

                payload = {
                    "type": "edit",
                    "message_id": message_id,
                    "content": content,
                }
                await message_connection.broadcast(workspace_id, tab_id, json.dumps(payload))

    except WebSocketDisconnect:
        print("********* Message websocket disconnected *********")
        message_connection.disconnect(workspace_id, tab_id, websocket)

@router.websocket("/like/{workspace_id}/{tab_id}")
async def websocket_endpoint_like(websocket: WebSocket, workspace_id: int, tab_id: int):
    await like_connection.connect(workspace_id, tab_id, websocket)
    try:
        while True:
            print("********* in ws like endpoint, while **********")
            raw_data = await websocket.receive_text()
            data = json.loads(raw_data)

            user_id = data["userId"]
            message_id = data["messageId"]
            emoji_type = data["emojiType"]
            action = data["action"] == "like"
            count = data["count"]

            if action:
                count += 1
            else:
                count -= 1

            if not user_id or not message_id:
                print(f"Invalid like data received: {data}")
                continue

            await message_service.toggle_like(tab_id, message_id, user_id, emoji_type, action)

            payload = {
                "type": "emoji",
                "emojiType": emoji_type,
                "messageId": message_id,
                "count": count
            }

            await like_connection.broadcast(workspace_id, tab_id, json.dumps(payload))

    except WebSocketDisconnect:
        print("********* Like websocket disconnected *********")
        like_connection.disconnect(workspace_id, tab_id, websocket)
    except Exception as e:
        print(f"An error occurred in like websocket: {e}")
        like_connection.disconnect(workspace_id, tab_id, websocket)


@router.websocket("/profile/{workspace_id}/{tab_id}")
async def websocket_endpoint_profile(websocket: WebSocket, workspace_id: int, tab_id: int):
    await profile_connection.connect(workspace_id, tab_id, websocket)
    try:
        while True:
            print("********* in ws profile endpoint, while **********")
            raw_data = await websocket.receive_text()
            data = json.loads(raw_data)

            sender_id = data["sender_id"]
            nickname = data["nickname"]
            image = data["image"]

            payload = {
                "sender_id": sender_id,
                "nickname": nickname,
                "image": image
            }

            await profile_connection.broadcast(workspace_id, tab_id, json.dumps(payload))

    except WebSocketDisconnect:
        print("********* Like websocket disconnected *********")
        profile_connection.disconnect(workspace_id, tab_id, websocket)
    except Exception as e:
        print(f"An error occurred in like websocket: {e}")
        profile_connection.disconnect(workspace_id, tab_id, websocket)
