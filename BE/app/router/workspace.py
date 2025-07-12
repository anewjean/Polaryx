import uuid
from fastapi import APIRouter, Depends, Request

from app.core.security import verify_token_and_get_token_data
from app.repository.sub_tabs import QueryRepo as SubTabRepo
from app.repository.workspace_member import QueryRepo as WorkspaceMemRepo
from app.repository.tab import TabRepository

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

# 워크스페이스 정보 조회
@router.get("/{workspace_id}/title", response_model=WorkspaceNameSchema)
def get_workspace_info(workspace_id: int):
    row = workspace_service.get_workspace_info(workspace_id)
    return WorkspaceNameSchema.from_row(row)

# 회원 등록(파일 임포트)
@router.post("/{workspace_id}/users", response_model=InsertWorkspaceSchema)
async def register_members(request: Request, workspace_id: int):
    datas: dict = await request.json()
    res = workspace_member_service.register_member(workspace_id, datas)
    return InsertWorkspaceSchema.from_dict(res)

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

# 회원 등록(개별) - 미완.
@router.post("/{workspace_id}/users/single", response_model=InsertWorkspaceSchema)
async def register_member(workspace_id: int, request: Request):#, token_user_id_and_email = Depends(verify_token_and_get_token_data)):
    user: dict = await request.json()
    print("in register_member, user: ", user)
    # data = { "users" : user }     # 만약에 users로 보내주는게 아닌, email, name, ... , github 이것만 보내주면 한번 래핑하기.
    # data = { "users" : [ user["user"] ] }     # 만약에 users로 보내주는게 아닌, user로 보내줬다면 다시 users로 래핑하기.    

    data = { "users" : [ user["users"] ] }     # 만약에 users로 보내주는게 아닌, user로 보내줬다면 다시 users로 래핑하기.    
    res = workspace_member_service.import_users(workspace_id, data)
    print("in register_member, res: ", res)
    return InsertWorkspaceSchema.from_dict(res)