from typing import List, Annotated
from fastapi.responses import HTMLResponse
from fastapi import APIRouter, Depends, Path

from app.core.security import verify_token_and_get_token_data
from app.domain.message import Message
from app.service.group import GroupsService
from app.schema.message.message_update_request import MessageUpdateRequest
from app.schema.group.response import GroupSchema

router = APIRouter(prefix="/workspaces")
group_service = GroupsService()

# 그룹 조회
@router.get("/{workspace_id}/groups", response_model=List)
async def get_group (workspace_id: int):#, token_user_id_and_email = Depends(verify_token_and_get_token_data)):
    rows = group_service.find_all_groups_by_wid(workspace_id)
    res = GroupSchema.from_row(rows)
    return res.infos

# 그룹 생성
@router.post("/{workspace_id}/groups")
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