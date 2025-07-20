from fastapi import APIRouter
from typing import List, Dict
from app.schema.direct_message.request import CreateTabRequest
from app.schema.direct_message.response import CreateTabResponse
from app.service.tab import TabService
from app.service.direct_message import DMService


router = APIRouter(prefix="/workspaces")
dm_service = DMService()
tab_service = TabService()

# dm 생성
@router.post("/{workspace_id}/dms", response_model=CreateTabResponse)
def get_tab(workspace_id: int, tab_data: CreateTabRequest):
    creator_id = tab_data.user_id
    member_ids = tab_data.user_ids
    members_map = dm_service.find_member_names(member_ids)

    creator_name = members_map.get(creator_id)
    tab_name = ", ".join([name for _, name in members_map.items()])

    section_id = 4
    row = dm_service.get_tab(creator_id, member_ids, workspace_id, tab_name, section_id)
    return CreateTabResponse.from_row(row, creator_name)