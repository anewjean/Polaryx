import logging
from fastapi import APIRouter, Path, Depends, Query
from typing import List, Dict
from app.schema.tab.request import CreateTabRequest, InviteRequest
from app.schema.tab.response import TabInfo, TabDetailInfo, TabMember, TabInvitation
from app.service.tab import TabService
from app.core.security import verify_token_and_get_token_data

router = APIRouter(prefix="/api/workspaces")
service = TabService()

# 탭 이름 중복 확인
@router.get("/{workspace_id}/sections/{section_id}/tabs")
def validate_tab_name(workspace_id: int, section_id:int ,name: str = Query(None, alias="name")):
    is_duplicate = service.is_tab_name_duplicate(workspace_id, section_id, name)
    if is_duplicate:
        return False
    else:
        return True

# 탭 추가
@router.post("/{workspace_id}/tabs")
def create_tab(workspace_id: int, tab_data: CreateTabRequest):
    tab_data.workspace_id = workspace_id
    service.create_tab(tab_data)
    return {"message": "Tab created successfully."}

# 참여중인 탭 리스트 조회
@router.get("/{workspace_id}/tabs", response_model=List[TabInfo])
def get_tabs(workspace_id: int, user_info: Dict = Depends(verify_token_and_get_token_data)):    
    user_id = user_info.get("user_id")
    logging.info(f"[get_tabs] Extracted user_id: {user_id}")
    return service.find_tabs(workspace_id, user_id)

# 특정 탭 정보 상세 조회
@router.get("/{workspace_id}/tabs/{tab_id}/info", response_model=TabDetailInfo)
def get_tab(workspace_id: int, tab_id: int):
    return service.find_tab(workspace_id, tab_id)

# 탭 참여 인원 조회
@router.get("/{workspace_id}/tabs/{tab_id}/members", response_model=List[TabMember])
def get_tab_members(workspace_id: int, tab_id: int):
    return service.get_tab_members(workspace_id, tab_id)

# 탭 참여 가능 인원 조회
@router.get("/{workspace_id}/tabs/{tab_id}/non-members", response_model=List[TabMember])
def get_available_tab_members(workspace_id: int, tab_id: int):
    return service.get_available_tab_members(workspace_id, tab_id)

# 탭 인원 초대
@router.post("/{workspace_id}/tabs/{tab_id}/members", response_model=TabInvitation)
def invite_members(workspace_id: int, tab_id: int, user_ids: InviteRequest):
    rows = service.invite_members(workspace_id, tab_id, user_ids.user_ids)
    return TabInvitation.from_rows(rows)