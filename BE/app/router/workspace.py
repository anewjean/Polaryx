import uuid
from fastapi import APIRouter, Depends, Request

from app.core.security import verify_token_and_get_token_data
from app.repository.sub_tabs import QueryRepo as SubTabRepo
from app.repository.workspace_member import QueryRepo as WorkspaceMemRepo
from app.repository.role import QueryRepo as RolesRepository # 명훈 추가
from app.repository.member_roles import MemberRolesRepository # 명훈 추가
from app.repository.tab import TabRepository

from app.service.users import UserService
from app.service.workspace import WorkspaceService
from app.service.workspace_member import WorkspaceMemberService

from app.schema.workspace.response import WorkspaceNameSchema
from app.schema.workspace.response import WorkspaceMembersSchema
from app.schema.workspace.response import InsertWorkspaceSchema

router = APIRouter(prefix="/workspaces")

workspace_service = WorkspaceService()
workspace_mem_repo = WorkspaceMemRepo()
tab_repo = TabRepository()
sub_tab_repo = SubTabRepo()
workspace_member_service = WorkspaceMemberService()
roles_repo = RolesRepository() # 명훈 추가
member_roles_repo = MemberRolesRepository() # 명훈 추가
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

# 워크스페이스 정보 조회
@router.get("/{workspace_id}/title", response_model=WorkspaceNameSchema)
def get_workspace_info(workspace_id: int):
    row = workspace_service.get_workspace_info(workspace_id)
    return WorkspaceNameSchema.from_row(row)

# 회원 등록(파일 임포트)
@router.post("/{workspace_id}/users", response_model=InsertWorkspaceSchema)
async def register_members(request: Request, workspace_id: int):
    datas: dict = await request.json()
    res = workspace_member_service.register_member(workspace_id, datas)
    return InsertWorkspaceSchema.from_dict(res)

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
                # "user_name": target[0][1],
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

def create_member_roles(i, user_id: str):
    roles = roles_repo.get_all_roles()
    role_id = next((r[0] for r in roles if r[1] == i["role"]), None)
    member_roles_repo.insert_member_roles(user_id, i["name"], role_id)

@router.get("/{workspace_id}/userinfo")
async def get_user_columns(request: Request):
    columns = workspace_member_service.get_member_by_workspace_columns()
    return columns

# 회원 리스트 조회
@router.get("/{workspace_id}/users", response_model=WorkspaceMembersSchema)
async def get_members(workspace_id: int, token_user_id_and_email = Depends(verify_token_and_get_token_data)):
    rows = workspace_member_service.get_member_by_workspace_id(workspace_id)
    return WorkspaceMembersSchema.from_row(rows)

# 회원 등록(개별) - 미완.
@router.post("/{workspace_id}/users/single", response_model=InsertWorkspaceSchema)
async def register_member(workspace_id: int, request: Request):#, token_user_id_and_email = Depends(verify_token_and_get_token_data)):
    user: dict = await request.json()
    print("in register_member, user: ", user)
    # data = { "users" : user }     # 만약에 users로 보내주는게 아닌, email, name, ... , github 이것만 보내주면 한번 래핑하기.
    # data = { "users" : [ user["user"] ] }     # 만약에 users로 보내주는게 아닌, user로 보내줬다면 다시 users로 래핑하기.    

    data = { "users" : [ user["users"] ] }     # 만약에 users로 보내주는게 아닌, user로 보내줬다면 다시 users로 래핑하기.    
    res = workspace_member_service.import_users(workspace_id, data)
    print("in register_member, res: ", res)
    return InsertWorkspaceSchema.from_dict(res)