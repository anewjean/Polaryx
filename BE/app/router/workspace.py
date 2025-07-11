import uuid
from fastapi import APIRouter, Depends, Request

from app.core.security import verify_token_and_get_token_data
from app.repository.sub_tabs import QueryRepo as SubTabRepo
from app.repository.workspace_member import QueryRepo as WorkspaceMemRepo
from app.repository.roles import RolesRepository # 명훈 추가
from app.repository.member_roles import MemberRolesRepository # 명훈 추가
from app.repository.tab import TabRepository

from app.service.users import UserService
from app.service.workspace import WorkspaceService
from app.service.workspace_member import WorkspaceMemberService

from app.schema.workspace.response import WorkspaceNameSchema
from app.schema.workspace.response import WorkspaceMembersSchema
from app.schema.workspace.response import InsertWorkspaceSchema

router = APIRouter(prefix="/workspaces")

workspace_service = WorkspaceService()
workspace_mem_repo = WorkspaceMemRepo()
tab_repo = TabRepository()
sub_tab_repo = SubTabRepo()
workspace_member_service = WorkspaceMemberService()
roles_repo = RolesRepository() # 명훈 추가
member_roles_repo = MemberRolesRepository() # 명훈 추가
user_service = UserService()

# 워크스페이스 정보 조회
@router.get("/{workspace_id}/title", response_model=WorkspaceNameSchema)
def get_workspace_info(workspace_id: int):
    row = workspace_service.get_workspace_info(workspace_id)
    return WorkspaceNameSchema.from_row(row)

# 회원 등록(파일 임포트)
@router.post("/{workspace_id}/users", response_model=InsertWorkspaceSchema)
async def create_users(request: Request, workspace_id):
    data: dict = await request.json()
    row = workspace_member_service.insert_workspace_members(data)
    return InsertWorkspaceSchema.from_row(len(data), row)

# 프로필 필드 조회
@router.get("/{workspace_id}/userinfo")
async def get_members(workspace_id: int, request: Request):
    columns = workspace_member_service.get_member_by_workspace_columns()
    return columns

# 회원 리스트 조회
@router.get("/{workspace_id}/users", response_model=WorkspaceMembersSchema)
async def get_members(workspace_id: int, token_user_id_and_email = Depends(verify_token_and_get_token_data)):
    rows = workspace_member_service.get_member_by_workspace_id(workspace_id)
    return WorkspaceMembersSchema.from_row(rows)

# 회원 등록(개별) - 미완. 시작 안함.
@router.post("/{workspace_id}/users/single", response_model=WorkspaceMembersSchema)
async def create_member(workspace_id: int, request: Request, token_user_id_and_email = Depends(verify_token_and_get_token_data)):
    user: dict = await request.json()
    # [0]: email
    # [1]: name
    # [2]: role
    # [3]: group
    # [4]: blog
    # [5]: github
    rows = workspace_member_service.insert_workspace_member(user)
    return WorkspaceMembersSchema.from_row(rows)