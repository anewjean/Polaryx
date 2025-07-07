from typing import List, Annotated
from fastapi.responses import HTMLResponse
from fastapi import APIRouter, Depends, Path

from app.core.security import verify_token_and_get_token_data
from app.domain.message import Message
from app.schema.message.message_update_request import MessageUpdateRequest
from app.schema.message.messages_response import MessageSchema, MessagesResponse

router = APIRouter(prefix="/groups")


@router.post("/")
async def create_group(
            group_name: str,
            group_desc: str,
            member_ids: List,
            workspace_id: Annotated[int, Path()],
            token_user_id_and_email = Depends(verify_token_and_get_token_data),
):
    

    return

@router.patch("/")
async def edit_group():
    return