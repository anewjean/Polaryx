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

    def make_group(self, group_names: List[str], workspace_id: int) -> dict:
        # 1번만 조회: id, name 둘 다 가져오기
        existing_groups = groups_repo.get_all_groups_with_id()  # [(id, name), ...]
        # 기존 그룹 이름 목록 + 매핑 정보 동시 생성
        existing_group_names = set()
        group_name_to_id = {}
        
        for group_id, group_name in existing_groups:
            existing_group_names.add(group_name)  # 비교용
            group_name_to_id[group_name] = group_id  # 매핑용
        
        # 새 그룹 생성
        for group_name in group_names:
            if group_name not in existing_group_names:  # set 조회 O(1)
                new_group_id = groups_repo.make_group(group_name, workspace_id)
                group_name_to_id[group_name] = new_group_id
        return group_name_to_id

    def insert_group_member(self, data: dict, insert_groups: dict):        
        # 각 사용자 데이터 처리
        for user in data["users"]:
            email = user["email"]
            group_list = user["group"]  # "정글 3팀, 정글10기"
            
            # 각 그룹별로 멤버 추가
            for group_name in group_list:
                if group_name in insert_groups:  # 그룹이 존재하는 경우만
                    group_id = insert_groups[group_name]
                    
                    # 그룹 멤버 추가용 데이터
                    member_data = {
                        "email": email,
                        "group_id": group_id,
                    }
                    
                    # Repository 호출
                    groups_repo.insert_group_member(member_data)
        
        return {"success": "그룹 멤버 추가 완료"}

    def insert_member_by_group_name(self, data: dict):
        return self.groups_repo.insert_member_by_group_name(data)
    
    def delete_grp_mem_by_ws_id(self, user_id: str, workspace_id: int) -> bool:
        target_user_id = UUID(user_id).bytes
        return self.groups_repo.delete_member(target_user_id, workspace_id)
