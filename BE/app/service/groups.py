from uuid import UUID, uuid4
from typing import List

from app.repository.groups import QueryRepo as GroupsRepo
from app.schema.workspace_members.response import (
    WorkspaceMemberResponse,
    WorkspaceMemberSchema,
)

groups_repo = GroupsRepo()

class GroupsService:
    def __init__(self):
        self.groups_repo = GroupsRepo()

    def insert_member_by_group_name(self, data: dict):
        return groups_repo.insert_member_by_group_name(data)