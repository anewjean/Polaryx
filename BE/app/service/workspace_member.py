from uuid import UUID, uuid4
from typing import List

from app.service.users import UserService
from app.service.group import GroupsService

from app.service.role import RoleService

from app.repository.role import QueryRepo as RolesRepository
from app.repository.member_roles import MemberRolesRepository # 명훈 추가

from app.domain.workspace_member import WorkspaceMember
from app.repository.workspace_member import QueryRepo as WorkspaceMemberRepo
from app.schema.workspace_members.request import UpdateWorkspaceMemberRequest
from app.schema.workspace_members.response import (
    WorkspaceMemberResponse,
    WorkspaceMemberSchema,
)

roles_repo = RolesRepository() # 명훈 추가
user_service = UserService()
groups_service = GroupsService()
role_service = RoleService()

class WorkspaceMemberService:
    def __init__(self):
        self.workspace_member_repo = WorkspaceMemberRepo()

    def import_users(self, workspace_id, data: dict) -> dict:
        fail_count = 0
        fail_list = []
        
        # 사용자 생성
        user_service.create_users_bulk(data, workspace_id)

        # 워크스페이스 멤버 생성
        self.insert_workspace_member(data, workspace_id)

        # 그룹 생성 및 멤버 추가
        insert_groups = groups_service.make_group(data["groups"], workspace_id)
        groups_service.insert_group_member(data, insert_groups)

        # 역할 생성
        role_service.insert_member_roles_bulk(data)

        return {
        "success_count": len(data["users"])
    }

    def insert_workspace_member(self, data: dict, workspace_id: int):
        workspace_member_list = []
        for workspace_member_data in data["users"]:
            workspace_member_list.append({
                "nickname": workspace_member_data["name"],
                "email": workspace_member_data["email"],
                "workspace_id": workspace_id,
                "id": uuid4().bytes,
                "blog": workspace_member_data["blog"],
                "github": workspace_member_data["github"],
            })
        workspace_member = self.workspace_member_repo.bulk_insert_workspace_member(workspace_member_list)
        return workspace_member
    # test
    
    def get_member_by_user_id(self, id: UUID | bytes) -> WorkspaceMember:
        user_id_bytes = id.bytes if isinstance(id, UUID) else id  
        workspace_member = self.workspace_member_repo.find_by_user_id(user_id_bytes)
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
  
    def get_member_by_workspace_id(self, workspace_id: int) -> List[tuple]:
        members_infos = self.workspace_member_repo.find_by_user_workspace_id(workspace_id)
        return members_infos

    def update_profile_by_user_id(self, user_id: UUID, payload: UpdateWorkspaceMemberRequest) -> WorkspaceMemberResponse:
        user_id_bytes = user_id.bytes  # BINARY(16)에 맞게 변환
        # 업데이트 쿼리는 영향받은 행 수만 반환하므로, 업데이트 후 다시 조회하여 데이터 반환
        self.workspace_member_repo.update(user_id_bytes, payload)
        updated_rows = self.workspace_member_repo.find_by_user_id(user_id_bytes)
        updated_member = WorkspaceMemberSchema.from_row(updated_rows[0])
        return WorkspaceMemberResponse(workspace_member=updated_member)