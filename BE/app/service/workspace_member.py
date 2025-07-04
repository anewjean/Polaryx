from uuid import UUID

from BE.app.domain.workspace_member import WorkspaceMember
from BE.app.repository.workspace_member import QueryRepo as WorkspaceMemberRepo


class WorkspaceMemberService:
    def __init__(self):
        self.workspace_member_repo = WorkspaceMemberRepo()
    
    def get_member_by_user_id(self, id: UUID) -> WorkspaceMember:
        workspace_member = self.workspace_member_repo.find_by_user_id(id)
        return workspace_member
    
    def get_member_by_email(self, email: str) -> WorkspaceMember:
        workspace_member = self.workspace_member_repo.find_by_email(email)
        return workspace_member
    
    def get_member_by_nickname(self, nickname: str) -> WorkspaceMember:
        workspace_member = self.workspace_member_repo.find_by_nickname(nickname)
        return workspace_member