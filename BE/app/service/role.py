from app.repository.role import QueryRepo as RolesRepo
from app.schema.workspace_members.response import (
    WorkspaceMemberResponse,
    WorkspaceMemberSchema,
)

roles_repo = RolesRepo()

class RolesService:
    def __init__(self):
        self.roles_repo = RolesRepo()

    def insert_member_roles(self, data: dict):
        return roles_repo.insert_member_roles(data)