from uuid import UUID

from BE.app.domain.workspace_member import WorkspaceMember
from BE.app.repository.workspace_member import QueryRepo as WorkspaceMemberRepo
from BE.app.schema.workspace_members.request import UpdateWorkspaceMemberRequest
from BE.app.schema.workspace_members.response import (
    WorkspaceMemberResponse,
    WorkspaceMemberSchema,
)

class WorkspaceMemberService:
    def __init__(self):
        self.workspace_member_repo = WorkspaceMemberRepo()
    
    def get_member_by_id(self, id: UUID):
        """Return the first row matching the given member ID or None."""
        rows = self.workspace_member_repo.find_by_id(id)
        return rows[0] if rows else None
    
    def get_member_by_email(self, email: str):
        rows = self.workspace_member_repo.find_by_email(email)
        return rows[0] if rows else None
    
    def get_all_members(self, workspace_id: int):
        return self.workspace_member_repo.find_all(workspace_id)
        
    def update_profile(self, id: UUID, update_data: UpdateWorkspaceMemberRequest) -> WorkspaceMemberResponse:
        self.workspace_member_repo.update(id, update_data)
        rows = self.workspace_member_repo.find_by_id(id)
        if not rows:
            raise ValueError("Updated member not found")
        workspace_member = WorkspaceMemberSchema.from_row(rows[0])
        return WorkspaceMemberResponse(workspace_member=workspace_member)
    
    def _to_response(self, member: WorkspaceMember) -> WorkspaceMemberResponse:
        from dataclasses import asdict

        data = asdict(member)
        data["id"] = member.id.hex
        data["user_id"] = member.user_id.hex
        return WorkspaceMemberResponse(**data)
