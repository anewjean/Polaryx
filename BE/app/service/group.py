from uuid import UUID, uuid4
from typing import List

from app.repository.group import QueryRepo as GroupsRepo
from app.schema.workspace_members.response import (
    WorkspaceMemberResponse,
    WorkspaceMemberSchema,
)

class GroupsService:
    def __init__(self):
        self.groups_repo = GroupsRepo()

    def insert_member_by_group_name(self, data: dict):
        return self.groups_repo.insert_member_by_group_name(data)
    
    def delete_grp_mem_by_ws_id(self, user_id: str, workspace_id: int) -> bool:
        target_user_id = UUID(user_id).bytes
        return self.groups_repo.delete_member(target_user_id, workspace_id)