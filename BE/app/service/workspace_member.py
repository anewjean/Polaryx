from uuid import UUID

from app.domain.workspace_member import WorkspaceMember
from app.repository.workspace_member import QueryRepo as WorkspaceMemberRepo
from app.schema.workspace_members.request import UpdateWorkspaceMemberRequest
from app.schema.workspace_members.response import (
    WorkspaceMemberResponse,
    WorkspaceMemberSchema,
)

class WorkspaceMemberService:
    def __init__(self):
        self.workspace_member_repo = WorkspaceMemberRepo()
    
    def insert_workspace_member(self, data: dict):
        workspace_member = self.workspace_member_repo.insert_workspace_member(data)
        return workspace_member

    def get_member_by_user_id(self, id: UUID.bytes) -> WorkspaceMember:
        workspace_member = self.workspace_member_repo.find_by_user_id(id.bytes)
        return workspace_member
    
    def get_member_by_email(self, email: str) -> WorkspaceMember:
        workspace_member = self.workspace_member_repo.find_by_email(email)
        return workspace_member
    
    def get_member_by_nickname(self, nickname: str) -> WorkspaceMember:
        workspace_member = self.workspace_member_repo.find_by_nickname(nickname)
        return workspace_member

    def get_member_by_workspace_columns(self) -> list[str]:
        workspace_columns = self.workspace_member_repo.find_by_workspace_columns()
        return workspace_columns
    
    def update_profile_by_user_id(self, user_id: UUID, payload: UpdateWorkspaceMemberRequest) -> WorkspaceMemberResponse:
      user_id_bytes = user_id.bytes  # BINARY(16)에 맞게 변환
      updated_member = self.workspace_member_repo.update(user_id_bytes, payload)
      return WorkspaceMemberResponse(workspace_member=updated_member)