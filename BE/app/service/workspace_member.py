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
roles_service = RoleService()

class WorkspaceMemberService:
    def __init__(self):
        self.workspace_member_repo = WorkspaceMemberRepo()

    def import_users(self, workspace_id, data: dict) -> dict:
        fail_count = 0
        fail_list = []
        
        # 사용자 생성
        # user_service.create_users_bulk(data, workspace_id)
        self.insert_workspace_member(data, workspace_id)

        # 그룹 생성 및 멤버 추가
        # insert_groups = groups_service.make_group(data["groups"], workspace_id)
        # groups_service.insert_group_member(data, insert_groups)


        # groups_service.insert_member_by_group_name(data["groups"])
        # for user_data in data["users"]:
        #     print(workspace_id, user_data)
        # fail_count: int = 0
        # fail_list = []
        # # step 1.일단 이름이랑 email 받아와서,
        # # user 테이블에 겹치는 애들이 있는지 확인 -> email로만 확인해도 될 듯.
        # for i in data["users"]:
        #     # ["email"]
        #     # ["name"]
        #     # ["role"]  -> role name? 
        #     # ["group"] -> group name?  이 둘은 아직 처리하는 로직 없음.
        #     # ["blog"]
        #     # ["github"]
        #     print("i:" , i)
        #     print("i[email]", i["email"])
        #     target = user_service.find_user_by_email(i["email"])
        #     # email이 안겹친다면? user 테이블에 정보 추가 및 생성.
        #     # 생성 하면서 user id 만들어주기.

        #     if target:
        #         # 이미 존재하는 유저는 실패로 간주
        #         print("이미 존재하는 유저\n")
        #         fail_count += 1
        #         fail_list.append(i["name"])
        #         continue

        #     # UUID 객체 생성. 객체명은 바로 바꿀거라 중요하지 않음.
        #     uuid_obj1 = uuid4()
        #     user_uuid = uuid_obj1.bytes

        #     target_data = {
        #         "id": user_uuid,
        #         "user_name": i["name"],
        #         "user_email": i["email"],
        #         "provider": "google",
        #         "workspace_id": 1
        #     }
        #     print("target_data", target_data["user_email"])
        #     # usertable에 넣어주기.
        #     user_service.create_user_in_usertable(target_data)

        #     # 잘 들어갔는지 확인.
        #     target = user_service.find_user_by_email(target_data["user_email"])
        #     print("target", target)
        #     # user가 안만들어졌다? -> error
        #     if not target:
        #         print("\nerror\n")
        #         print("no target\n")
        #         fail_count += 1
        #         fail_list.append(i["name"])
        #         continue

        #     target_user_id = target[0][0]
        #     print("target_user_id", target_user_id)
        #     target_in_wm = self.get_member_by_user_id(target_user_id)
        #     print("target_in_wm", target_in_wm)
        #     if not target_in_wm:
        #         uuid_obj2 = uuid4()
        #         wm_id = uuid_obj2.bytes
                
        #         target_data = {
        #             "user_id": target[0][0],
        #             "nickname": target[0][1],
        #             "email": target[0][2],
        #             "workspace_id": int(workspace_id),
        #             "id": wm_id,
        #             "image" : None,
        #             "blog" : i["blog"],
        #             "github" : i["github"],
        #         }
        #         self.insert_workspace_member(target_data)

        #         target_in_wm = self.get_member_by_user_id(target_user_id)

        #         if not target_in_wm:
        #             fail_count += 1
        #             fail_list.append(i["name"])
        #             continue
                
        #         target_data = {
        #             "user_id": target[0][0],
        #             "nickname": target[0][1],
        #             "role" : i["role"],
        #             "group" : i["group"],
        #         }
        #         groups_service.insert_member_by_group_name(target_data)
        #         roles_service.insert_member_roles(target_data)

        # result = {
        #     "success_count": len(data["users"]) - fail_count,
        #     "fail_user_name": fail_list
        # }
        # return result

    # # 미완(group_id, user_id, user_name)
    # def insert_group_member(self, data: dict):
    #     return groups_service.insert_member_by_group_name(data)
        
    # # 미완
    # def insert_member_roles(self, user_id, role_name: str):
    #     # 아마 role_service를 만든 이후에 작성하는게 좋을 듯.
    #     return

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
    
    def get_member_by_user_id(self, id: UUID | bytes) -> WorkspaceMember:
        user_id_bytes = id.bytes if isinstance(id, UUID) else id  
        workspace_member = self.workspace_member_repo.find_by_user_id(user_id_bytes)
        return workspace_member
    
    # 사용할만한 게 여기까지 인듯?

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