import uuid
from fastapi import APIRouter, Depends, Request

from app.core.security import verify_token_and_get_token_data
from app.repository.sub_tabs import QueryRepo as SubTabRepo
from app.repository.workspace_member import QueryRepo as WorkspaceMemRepo
from app.repository.tab import TabRepository

from app.service.users import UserService
from app.service.workspace import WorkspaceService
from app.service.workspace_member import WorkspaceMemberService

from app.schema.workspace.response import WorkspaceNameSchema

router = APIRouter(prefix="/workspaces")

workspace_service = WorkspaceService()
workspace_mem_repo = WorkspaceMemRepo()
tab_repo = TabRepository()
sub_tab_repo = SubTabRepo()
workspace_member_service = WorkspaceMemberService()
user_service = UserService()


@router.get("/{workspace_id}")
async def get_workspace_tab(workspace_id: str,
                            token_user_id_and_email = Depends(verify_token_and_get_token_data),
                            ) -> list:

    tab_member_datas = tab_repo.find_by_user_id(uuid.UUID(token_user_id_and_email["user_id"]).bytes)

    result = []
    for data in tab_member_datas:
        tab_data = tab_repo.find_tabs_by_id(data["tab_id"])
        sub_tab_data = sub_tab_repo.find_sub_tabs_by_tab_id(data["tab_id"])

        result.append({
            "id": data["tab_id"],
            "name": tab_data["name"],
            "section_id": tab_data["section_id"],
            "sub_tab_data":{
                "name":sub_tab_data["name"],
            }
        })

    return result

@router.get("/{workspace_id}/title", response_model=WorkspaceNameSchema)
def get_workspace_info(workspace_id: int):
    row = workspace_service.get_workspace_info(workspace_id)
    return WorkspaceNameSchema.from_row(row)

@router.post("/{workspace_id}/users")
async def create_users(request: Request, workspace_id):
    data: dict = await request.json()
    fail_count: int = 0
    fail_list = []

    # step 1.일단 이름이랑 email 받아와서,
    # user 테이블에 겹치는 애들이 있는지 확인 -> email로만 확인해도 될 듯.
    for i in data["users"]:
        target = user_service.find_user_by_email(i["email"])
        # email이 안겹친다면? user 테이블에 정보 추가 및 생성.
        # 생성 하면서 user id 만들어주기.
        if not target:
            print("in not target\n")
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
            # usertable에 넣어주기.
            user_service.create_user_in_usertable(target_data)

            # 잘 들어갔는지 확인.
            target = user_service.find_user_by_email(target_data["user_email"])
            # user가 안만들어졌다? -> error
            if not target:
                fail_count += 1
                fail_list.append(i["name"])
                continue

        target_user_id = target[0][0]
        target_in_wm = workspace_member_service.get_member_by_user_id(target_user_id)
            
        if not target_in_wm:
            uuid_obj2 = uuid.uuid4()
            wm_id = uuid_obj2.bytes
            
            target_data = {
                "user_id": target[0][0],
                "user_name": target[0][1],
                "user_email": target[0][2],
                "workspace_id": workspace_id,
                "role_id": 1,
                "id": wm_id,                
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


@router.get("/{workspace_id}/users")
async def create_users(request: Request):
    columns = workspace_member_service.get_member_by_workspace_columns()
    return columns
