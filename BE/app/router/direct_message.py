from fastapi import APIRouter
from typing import List, Dict
from app.schema.direct_message.request import CreateTabRequest
from app.schema.direct_message.response import CreateTabResponse
from app.service.tab import TabService
from app.service.direct_message import DMService


router = APIRouter(prefix="/workspaces")
tab_service = TabService()
dm_service = DMService()

# 탭 생성
@router.post("/{workspace_id}/dms", response_model=CreateTabResponse)
def create_tab(workspace_id: int, tab_data: CreateTabRequest):
    member_names = dm_service.find_member_names(tab_data.user_ids)
    tab_name = ", ".join(member_names)
    section_id = 4
    subsection_id = None
    rows = tab_service.create_tab(tab_data.user_ids, workspace_id, tab_name, section_id, subsection_id)
    return CreateTabResponse.from_row(rows[0])