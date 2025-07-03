from uuid import UUID

from app.domain.workspace_member import WorkspaceMember
from app.repository.workspace_member import QueryRepo as WorkspaceMemberRepo


class WorkspaceMemberService:
    def __init__(self):
        self.workspace_member_repo = WorkspaceMemberRepo()
    
    def get_member_by_id(self, id: UUID) -> WorkspaceMember:
        workspace_member = self.workspace_member_repo.find_by_id(id)
        return workspace_member
    
    def get_member_by_email(self, email: str) -> WorkspaceMember:
        workspace_member = self.workspace_member_repo.find_by_email(email)
        return workspace_member