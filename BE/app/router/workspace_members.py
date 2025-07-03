from fastapi import APIRouter, Depends, HTTPException, status
from BE.app.schema.workspace_members.request import UpdateWorkspaceMemberRequest
from BE.app.schema.workspace_members.response import WorkspaceMemberSchema, WorkspaceMemberResponse
from BE.app.service.workspace_member import WorkspaceMemberService
from uuid import UUID

router = APIRouter()
service = WorkspaceMemberService()

# @router.get("/workspace_members/me", response_model=WorkspaceMemberResponse)
# def get_my_profile():
#     # TODO: 나중에 JWT에서 현재 사용자 정보 추출
#     workspace_member_id = bytes.fromhex("9C27B022568A11F097058C554A43DA90")
#     return service.get_member_by_id(workspace_member_id)

@router.get("/workspace_members/{workspace_members_id}", response_model=WorkspaceMemberResponse)
def get_workspace_member_profile(workspace_members_id: str):
    # workspace_member_id = bytes.fromhex(workspace_members_id)
    workspace_member_id = workspace_members_id
    # workspace_member_id = UUID(workspace_members_id)
    row = service.get_member_by_id(workspace_member_id)
    workspace_member = WorkspaceMemberSchema.from_row(row)
    return WorkspaceMemberResponse(workspace_member=workspace_member)


@router.patch("/workspace_members/me", response_model=WorkspaceMemberResponse)
def update_my_profile(payload: UpdateWorkspaceMemberRequest):
    workspace_member_id = bytes.fromhex("9C27B022568A11F097058C554A43DA90")
    return service.update_profile(workspace_member_id, payload)

