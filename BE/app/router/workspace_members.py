from fastapi import APIRouter, Depends, HTTPException, status
from app.schema.workspace_members.request import UpdateWorkspaceMemberRequest
from app.schema.workspace_members.response import WorkspaceMemberSchema, WorkspaceMemberResponse
from app.service.workspace_member import WorkspaceMemberService
from uuid import UUID


router = APIRouter(prefix="/api/workspaces")
service = WorkspaceMemberService()

@router.get("/{workspace_id}", response_model=WorkspaceMemberSchema)
def get_workspace_member_profile(workspace_id: int, user_id: str):
    uuid_obj = UUID(user_id)  # str → UUID 변환
    row = service.get_member_by_user_id(uuid_obj)
    return WorkspaceMemberSchema.from_row(row)

@router.patch("/{workspace_id}/{user_id}", response_model=WorkspaceMemberSchema)
def update_profile(workspace_id: int, user_id: str, payload: UpdateWorkspaceMemberRequest):
    response = service.update_profile_by_user_id(UUID(user_id), payload)
    return response.workspace_member
