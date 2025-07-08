import uuid
from fastapi import APIRouter, Depends, Request

from app.core.security import verify_token_and_get_token_data

from app.repository.tab_members import QueryRepo as TabMembersRepo
from app.repository.tabs import QueryRepo as TabRepo
from app.repository.sub_tabs import QueryRepo as SubTabRepo
from app.repository.workspace_member import QueryRepo as WorkspaceMemRepo
from app.repository.roles import RolesRepository # 명훈 추가
from app.repository.member_roles import MemberRolesRepository # 명훈 추가

from app.service.users import UserService
from app.service.workspace import WorkspaceService
from app.service.workspace_member import WorkspaceMemberService

from app.schema.workspace.response import WorkspaceNameSchema

router = APIRouter(prefix="/workspaces")

workspace_service = WorkspaceService()

workspace_mem_repo = WorkspaceMemRepo()
tab_members_repo = TabMembersRepo()
tab_repo = TabRepo()
sub_tab_repo = SubTabRepo()
workspace_member_service = WorkspaceMemberService()
roles_repo = RolesRepository() # 명훈 추가
member_roles_repo = MemberRolesRepository() # 명훈 추가


@router.get("/{workspace_id}")
async def get_workspace_tab(workspace_id: str,  # 아직 workspace_id는 필요없는 듯.
                            token_user_id_and_email = Depends(verify_token_and_get_token_data),
                            ) -> list:
    # user_id를 통해서 tab_members에 먼저 접근한 뒤에,
    # user가 member로 속해있는 여러 tab_id를 다 받아옴.
    # tab_members : tab_id, user_id, id
    # 반환 값은 list임.
    
    print(uuid.UUID(token_user_id_and_email["user_id"]).bytes)

    tab_member_datas = TabMembersRepo.find_by_user_id(tab_members_repo, uuid.UUID(token_user_id_and_email["user_id"]).bytes)

    print(tab_member_datas)

    result = []
    # 그럼 tab_id로 tabs, sub_tabs 테이블에 접근해서 name(tabs), name(sub_tabs), section_id(tabs) 얻어내기.
    # 그리고 tab_id(tab_members), tab_name, section_id 보내주기.
    for data in tab_member_datas:
        # tab, sub_tab 데이터 받아오기
        tab_data = TabRepo.find_tabs_by_id(tab_repo, data["tab_id"])
        sub_tab_data = SubTabRepo.find_sub_tabs_by_tab_id(sub_tab_repo, data["tab_id"])

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
    print("create_users\n")
    for i in data["users"]:
        target = UserService.find_user_by_email(i["email"])
        print("target", target)
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
            UserService.create_user_in_usertable(target_data)

            print("create_member_roles\n")
            create_member_roles(i, user_uuid) # hack: 이거 안될 수도 잇음.

            # 잘 들어갔는지 확인.
            print("find_user_by_email\n")
            target = UserService.find_user_by_email(target_data["user_email"])
            # user가 안만들어졌다? -> error
            if not target:
                print("\nerror\n")
                print("no target\n")
                fail_count += 1
                fail_list.append(i["name"])
                continue

        target_user_id = target[0][0]
        print("get_member_by_user_id\n")
        target_in_wm = WorkspaceMemberService.get_member_by_user_id(WorkspaceMemberService(), target_user_id)
            
        if not target_in_wm:
            # 잘 만들어졋따? workspaces_member에 추가해주기.
            # ----- 아마 target 리스트일텐데 일단 고.
            print("not target_in_wm\n")
            print("insert_workspace_member\n")
            
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

            print(target_data)
            print("\n")
            
            WorkspaceMemberService.insert_workspace_member(WorkspaceMemberService(), target_data)
            
            # 잘 들어갔는지 확인.
            print("get_member_by_user_id\n")
            target_in_wm = WorkspaceMemberService.get_member_by_user_id(WorkspaceMemberService(), target_user_id)
            print(target_in_wm)
            print("\n")
            if not target_in_wm:
                print("\nerror\n")
                fail_count += 1
                fail_list.append(i["name"])

    result = {
        "success_count": len(data["users"]) - fail_count,
        "fail_user_name": fail_list
    }
    print(result)
    print("\n")
    
    return result 

def create_member_roles(i, user_id: str):
    roles = roles_repo.get_all_roles()
    role_id = next((r[0] for r in roles if r[1] == i["role"]), None)

    if role_id is None:
        raise ValueError(f"역할 {i['role']}에 해당하는 role_id를 찾을 수 없습니다.")

    test = member_roles_repo.insert_member_roles(user_id, role_id)
    print("test", test)

@router.get("/{workspace_id}/users")
async def create_users(request: Request):
    columns = workspace_member_service.get_member_by_workspace_columns()
    return columns
