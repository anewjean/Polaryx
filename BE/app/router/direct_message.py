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
    creator_id = tab_data.user_id
    member_ids = tab_data.user_ids
    members_map = dm_service.find_member_names(member_ids)
    
    # user_id에 해당하는 이름을 찾아서 탭 네임 지정 시 제외
    creator_name = members_map.get(creator_id)
    if len(members_map) > 1:        
        # 다른 멤버들의 이름 목록 생성
        other_member_names = [name for id, name in members_map.items() if id != creator_id]
        tab_name = ", ".join(other_member_names)
    # 본인과의 DM인 경우 탭 네임으로 지정
    else:
        tab_name = creator_name
        
    section_id = 4
    row = dm_service.get_tab(creator_id, member_ids, workspace_id, tab_name, section_id)
    return CreateTabResponse.from_row(row)