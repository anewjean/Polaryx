from fastapi import APIRouter, Depends, Query
from typing import List, Dict
from app.schema.tab.request import CreateTabRequest, InviteRequest
from app.schema.tab.response import TabInfo, TabDetailInfo, TabMember, TabInvitation, CreateTabResponse
from app.service.tab import TabService
from app.core.security import verify_token_and_get_token_data
from app.repository.workspace_member import QueryRepo as WorkspaceMemRepo

router = APIRouter(prefix="/workspaces")
service = TabService()

# 탭 이름 중복 확인
@router.get("/{workspace_id}/sections/{section_id}/tabs")
def validate_tab_name(workspace_id: str, section_id: str, name: str = Query(None, alias="name")):
    is_duplicate = service.is_tab_name_duplicate(workspace_id, section_id, name)
    if is_duplicate:
        return False
    else:
        return True

# 탭 추가
@router.post("/{workspace_id}/tabs", response_model=CreateTabResponse)
def create_tab(workspace_id: int, tab_data: CreateTabRequest, user_info: Dict = Depends(verify_token_and_get_token_data)):
    user_id = user_info.get("user_id")
    tab_name = tab_data.tab_name
    section_id = tab_data.section_id
    row = service.create_tab([user_id], workspace_id, tab_name, section_id)
    return CreateTabResponse.from_row(row)

# 참여중인 탭 리스트 조회
@router.get("/{workspace_id}/tabs", response_model=List[TabInfo])
def get_tabs(workspace_id: int, user_info: Dict = Depends(verify_token_and_get_token_data)):
    user_id = user_info.get("user_id")
    rows = service.find_tabs(workspace_id, user_id)
    return [TabInfo.from_row(row) for row in rows]

# 특정 탭 정보 상세 조회
@router.get("/{workspace_id}/tabs/{tab_id}/info", response_model=TabDetailInfo)
def get_tab(workspace_id: int, tab_id: int):
    rows = service.find_tab(workspace_id, tab_id)
    return TabDetailInfo.from_rows(rows)

# 탭 참여 인원 조회
@router.get("/{workspace_id}/tabs/{tab_id}/members", response_model=List[TabMember])
def get_tab_members(workspace_id: int, tab_id: int):
    rows = service.get_tab_members(workspace_id, tab_id)
    return [TabMember.from_row(row) for row in rows]

# 탭 참여 가능 인원 조회
@router.get("/{workspace_id}/tabs/{tab_id}/non-members", response_model=List[TabMember])
def get_available_tab_members(workspace_id: int, tab_id: int):
    rows = service.get_available_tab_members(workspace_id, tab_id)
    return [TabMember.from_row(row) for row in rows]

# 탭 인원 초대
@router.post("/{workspace_id}/tabs/{tab_id}/members", response_model=TabInvitation)
def invite_members(workspace_id: int, tab_id: int, user_ids: InviteRequest):
    rows = service.invite_members(workspace_id, tab_id, user_ids.user_ids)
    return TabInvitation.from_rows(rows)

# 탭에 그룹 초대(미완)
@router.post("/{workspace_id}/tabs/{tab_id}/groups/{group_id}")
async def invite_group_to_tab(
            workspace_id: int,
            tab_id: int,
            group_id: int,
            user_info: Dict = Depends(verify_token_and_get_token_data),
):

    #######################################################
    # 추가 -> 현재 채팅 기능에 초대된 사람 추가.
    # 고민해볼 것: 지금까지 대화내역들 초대된 사람한테도 보이게 할까?
    # 이건 선택할 수 있을 듯.
    #######################################################

    return

# 탭 나가기
@router.patch("/{workspace_id}/tabs/{tab_id}/out")
async def exit_tab(workspace_id: int, tab_id: int, user_ids: InviteRequest):  # user_ids는 똑같이 리스트를 쓰므로 일단 inviteRequest 사용.
    await service.exit_tab(workspace_id, tab_id, user_ids.user_ids)           # 리턴값은 없음. 그냥 웹소켓으로 쏴버렸으니까.
    return 

# 탭 내 멤버/그룹 검색(미완, 시작도 안함)
@router.get("/{workspace_id}/tabs/{tab_id}/search", response_model=TabInvitation)
def search_members(workspace_id: int, tab_id: int, user_ids: InviteRequest):
    rows = service.get_tab_members(workspace_id, tab_id, user_ids.user_ids)
    return TabInvitation.from_rows(rows)