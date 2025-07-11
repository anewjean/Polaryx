from uuid import UUID
from typing import List

from app.domain.workspace_member import WorkspaceMember
from app.repository.workspace_member import QueryRepo as WorkspaceMemberRepo
from app.schema.workspace_members.request import UpdateWorkspaceMemberRequest
from app.schema.workspace_members.response import (
    WorkspaceMemberResponse,
    WorkspaceMemberSchema,
)

class WorkspaceMemberService:
    def __init__(self):
        self.workspace_member_repo = WorkspaceMemberRepo()

    def create_member_roles(i, user_id: str):
        roles = roles_repo.get_all_roles()
        role_id = next((r[0] for r in roles if r[1] == i["role"]), None)
        member_roles_repo.insert_member_roles(user_id, i["name"], role_id)

    def insert_workspace_members(self, data: dict):
        fail_count: int = 0
        fail_list = []

        # step 1.일단 이름이랑 email 받아와서,
        # user 테이블에 겹치는 애들이 있는지 확인 -> email로만 확인해도 될 듯.
        for i in data["users"]:
            print("i[email]", i["email"])
            target = user_service.find_user_by_email(i["email"])
            # email이 안겹친다면? user 테이블에 정보 추가 및 생성.
            # 생성 하면서 user id 만들어주기.

            if target:
                # 이미 존재하는 유저는 실패로 간주
                print("이미 존재하는 유저\n")
                fail_count += 1
                fail_list.append(i["name"])
                continue

            # UUID 객체 생성. 객체명은 바로 바꿀거라 중요하지 않음.
            uuid_obj1 = uuid.uuid4()
            user_uuid = uuid_obj1.bytes

            target_data = {
                "id": user_uuid,
                "user_name": i["name"],
                "user_email": i["email"],
                "provider": "google",
                "workspace_id": 1
            }
            print("target_data", target_data["user_email"])
            # usertable에 넣어주기.
            user_service.create_user_in_usertable(target_data)

            create_member_roles(i, user_uuid) # hack: 이거 안될 수도 잇음.

            # 잘 들어갔는지 확인.
            target = user_service.find_user_by_email(target_data["user_email"])
            print("target", target)
            # user가 안만들어졌다? -> error
            if not target:
                print("\nerror\n")
                print("no target\n")
                fail_count += 1
                fail_list.append(i["name"])
                continue

            target_user_id = target[0][0]
            print("target_user_id", target_user_id)
            target_in_wm = workspace_member_service.get_member_by_user_id(target_user_id)
            print("target_in_wm", target_in_wm)
            if not target_in_wm:
                uuid_obj2 = uuid.uuid4()
                wm_id = uuid_obj2.bytes
                
                target_data = {
                    "user_id": target[0][0],
                    "nickname": target[0][1],
                    "email": target[0][2],
                    "workspace_id": int(workspace_id),
                    "id": wm_id,
                    "image" : None,                
                }

                workspace_member_service.insert_workspace_member(target_data)
                target_in_wm = workspace_member_service.get_member_by_user_id(target_user_id)

                if not target_in_wm:
                    fail_count += 1
                    fail_list.append(i["name"])

        result = {
            "success_count": len(data["users"]) - fail_count,
            "fail_user_name": fail_list
        }
        return result

    def insert_workspace_member(self, data: dict):
        workspace_member = self.workspace_member_repo.insert_workspace_member(data)
        return workspace_member
    
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