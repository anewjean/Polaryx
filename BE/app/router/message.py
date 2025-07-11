import ast
import json
from fastapi import WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi import APIRouter, Query
from datetime import datetime
import uuid

from app.service.websocket_manager import ConnectionManager
from app.service.message import MessageService
from app.service.workspace_member import WorkspaceMemberService
from app.domain.message import Message
from app.schema.message.message_update_request import MessageUpdateRequest
from app.schema.message.messages_response import MessageSchema, MessagesResponse

router = APIRouter()
connection = ConnectionManager()
message_service = MessageService()
workspace_member_service = WorkspaceMemberService()



@router.get("/workspaces/{workspace_id}/tabs/{tab_id}/messages", response_model=MessagesResponse)
async def find_all_messages(workspace_id: int, tab_id: int, before_id: int = Query(None)) -> MessagesResponse:
    
    # 디버깅용. 한번 싹 지우고 다시 하고 싶을때 쓰면 됨.
    # MessageService.delete_all_message(message_service)
    print("************ in find all messages **************")
    print("tab_id, before_id: ", tab_id, before_id)
    # 페이징 위해 교체 로직
    rows = await message_service.find_recent_messages(tab_id, before_id)
    rows.reverse()
    
    # 뒤집힌 rows
    # [0]: m.id
    # [1]: m.tab_id
    # [2]: m.sender_id
    # [3]: wm.nickname
    # [4]: wm.image
    # [5]: m.content
    # [6]: m.is_updated
    # [7]: m.created_at
    # [8]: m.updated_at
    # [9]: m.deleted_at
    # [10]: m.url
    
    # 원래 로직
    messages = [MessageSchema.from_row(row) for row in rows]
    return MessagesResponse(messages=messages)

@router.patch("/workspaces/{workspace_id}/tabs/{tab_id}/messages/{message_id}", status_code=204)
async def modify_message(workspace_id: int, tab_id: int, message_id: int, request: MessageUpdateRequest) -> None:
    # sender_id = request.sender_id
    new_content = request.new_content
    # workspace_member = workspace_member_service.get_member_by_id(sender_id)
    # message = message_service.modify_message(message_id, new_content)
    
    data = {
        "type": "update",
        # "sender_id": sender_id,
        # "nickname": workspace_member[0][3],
        "message_id": message_id,
        "new_content": new_content
    }

    await message_service.modify_message(message_id, new_content)
    await connection.broadcast(workspace_id, tab_id, data)

@router.delete("/workspaces/{workspace_id}/tabs/{tab_id}/messages/{message_id}", status_code=204)
async def delete_message(workspace_id: int, tab_id: int, message_id: int) -> None:
    data = {
        "type": "delete",
        "message_id": message_id
    }

    await message_service.delete_message(message_id)
    await connection.broadcast(workspace_id, tab_id, data)

