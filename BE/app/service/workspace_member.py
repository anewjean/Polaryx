from uuid import UUID

from BE.app.domain.workspace_member import WorkspaceMember
from BE.app.repository.workspace_member import QueryRepo as WorkspaceMemberRepo
from BE.app.schema.workspace_members.request import UpdateWorkspaceMemberRequest
from BE.app.schema.workspace_members.response import WorkspaceMemberResponse

class WorkspaceMemberService:
    def __init__(self):
        self.workspace_member_repo = WorkspaceMemberRepo()
    
    def get_member_by_id(self, id: UUID) -> WorkspaceMember:
        workspace_member = self.workspace_member_repo.find_by_id(id)
        return workspace_member
    
    def get_member_by_email(self, email: str) -> WorkspaceMember:
        workspace_member = self.workspace_member_repo.find_by_email(email)
        return workspace_member
    
    def get_all_members(self, workspace_id: int) -> list[WorkspaceMember]:
        all_workspace_members = self.workspace_member_repo.find_all(workspace_id)
        return all_workspace_members
        
    def update_profile(self, id: UUID, update_data: UpdateWorkspaceMemberRequest) -> WorkspaceMemberResponse:
        self.workspace_member_repo.update(id, update_data)
        updated = self.workspace_member_repo.find_by_id(id)
        return WorkspaceMemberResponse(**updated.to_dict())
    
    def _to_response(self, member: WorkspaceMember) -> WorkspaceMemberResponse:
        return WorkspaceMemberResponse(**member.to_dict())