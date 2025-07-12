from fastapi import APIRouter
from typing import List, Dict
from app.schema.direct_message.request import CreateTabRequest
from app.schema.direct_message.response import CreateTabResponse
from app.service.tab import TabService
from app.service.direct_message import DMService


router = APIRouter(prefix="/workspaces")
dm_service = DMService()

# 탭 생성
@router.post("/{workspace_id}/dms", response_model=CreateTabResponse)
def get_tab(workspace_id: int, tab_data: CreateTabRequest):
    member_names = dm_service.find_member_names(tab_data.user_ids)

    # user_id에 해당하는 이름을 찾아서 탭 네임 지정 시 제외
    if len(member_names) > 1:        
        current_user_name = member_names.get(tab_data.user_id)
        
        # 다른 멤버들의 이름 목록 생성
        other_member_names = [name for user_id, name in member_names.items() if user_id != tab_data.user_id]
        tab_name = ", ".join(other_member_names)
    
    # 본인과의 DM인 경우 탭 네임으로 지정
    else:
        tab_name = ", ".join(member_names.values())

    section_id = 4
    rows = dm_service.get_tab(tab_data.user_ids, workspace_id, tab_name, section_id)
    return CreateTabResponse.from_row(rows[0])