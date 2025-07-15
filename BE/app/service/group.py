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

    # 모든 그룹과 그룹 구성원 조회
    def find_all_groups_by_wid(self, workspace_id: int):
        res = self.groups_repo.find_all_groups_and_members(workspace_id)
        for i in range(0, len(res)):            
            if len(set(res[i][3])) == 1:
                res[i][3] = list(set(res[i][3]))[0]
                res[i][4] = str(list(set(res[i][4]))[0])
            else:
                res[i][3] = -1       
                res[i][4] = "MIXED"
        return res


    def insert_member_by_group_id(self, data: dict):
        return self.groups_repo.insert_member_by_group_id(data)

    def delete_grp_mem_by_ws_id(self, user_id: str, workspace_id: int) -> bool:
        target_user_id = UUID(user_id).bytes
        return self.groups_repo.delete_member(target_user_id, workspace_id)