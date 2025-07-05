from typing import List, Annotated
from fastapi import WebSocket, WebSocketDisconnect, Path
from fastapi.responses import HTMLResponse
from fastapi import APIRouter, Depends, Request

from app.core.security import verify_token_and_get_token_data
from app.domain.tab_members import TabMembers
from app.domain.tabs import Tabs, SubTabs
from app.repository.tab_members import QueryRepo as TabMembersRepo
from app.repository.tabs import QueryRepo as TabRepo
from app.repository.sub_tabs import QueryRepo as SubTabRepo
from app.repository.workspace_member import QueryRepo as WorkspaceMemRepo

from app.service.users import UserService
from app.service.workspace_member import WorkspaceMemberService


import uuid

router = APIRouter(prefix="/workspaces")
workspace_mem_repo = WorkspaceMemRepo()
tab_members_repo = TabMembersRepo()
tab_repo = TabRepo()
sub_tab_repo = SubTabRepo()
workspace_member_service = WorkspaceMemberService()


# 먼저 워크스페이스 접근하려고 하면,
# tab_id, 
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

@router.get("/{workspace_id}/dd")     # 굳이 여기선 액세스 토큰 유효성 검사 안해도 될것 같기도...?
async def cmp_with_all_tab_name(                            
                            workspace_id: str,              # 아직 workspace_id는 필요없는 듯.
                            name: str,               # 얘는 탭 이름이 될 놈.
                            section_id: int,         # 얘는 어느 섹션에 탭이 들어갈 것인가
                            # token_user_id_and_email = Depends(verify_token_and_get_token_data),
                            ) -> bool:
    data = {"workspace_id": workspace_id, "name": name, "section_id": section_id}

    # 새로 탭 생성 후 그 탭 받아오기.
    new_tab_data = TabRepo.find_tabs_by_all_properties(tab_repo, data)
    
    if not new_tab_data:
        return True
    else:
        return False
    


# 리턴해줘야 하는 것들 -> 생성한 tab_id, tab_name, tab_created_at
@router.post("/{workspace_id}/tabs/")
async def create_workspace_tab(
                            workspace_id: Annotated[str, Path()],     # 아직 workspace_id는 필요없는 듯.
                            name: str,               # 얘는 탭 이름이 될 놈.
                            section_id: int,         # 얘는 어느 섹션에 탭이 들어갈 것인가
                            token_user_id_and_email = Depends(verify_token_and_get_token_data),
                            ):

    # 탭은 단톡방같은거임.
    # 탭을 만들거면, 탭 테이블에 Row 하나 추가하는거.
    
    # workspace_id -> 받았음.
    # section_id -> 받음.
    # name 받음. 이거 세개만 설정하면 되네.
    data = {"workspace_id": workspace_id, "name": name, "section_id": section_id}

    # 새로 탭 생성 후 그 탭 받아오기.
    new_tab_data = TabRepo.insert_tab_and_get(tab_repo, data)
    
    # 탭만 생성하면 안되고, tab_members에 본인 먼저 넣어주기.
    # 생성한 탭의 id랑 user_id 넣어주기.
    user_id_and_tab_id = {"tab_id": new_tab_data["id"], "user_id":token_user_id_and_email["user_id"]}
    TabMembersRepo.insert_tab_members(tab_members_repo, user_id_and_tab_id)
    tab_member_data = TabMembersRepo.find_tab_member_by_user_id_and_tab_id(tab_members_repo, user_id_and_tab_id)

    if not tab_member_data:
        # 제대로 탭 멤버에 안들어간 경우 에러처리.
        return
    
    result = [
        {
            "tab_id": new_tab_data["id"],
            "name": new_tab_data["name"],
            "created_at": new_tab_data["created_at"]
        }
    ]

    return result


# 탭에 멤버 초대
@router.post("{workspace_id}/tabs/{tab_id}/members")
async def invite_member_to_tab(
            workspace_id: Annotated[str, Path()],
            tab_id: Annotated[int, Path()],
            member_ids: List[str],
            token_user_id_and_email = Depends(verify_token_and_get_token_data),
):
    # tab_members에 초대할 멤버 + tab_id 데이터 넣기.
    # 그럼 요청 본문에 넣고 싶은 멤버들 id? 이름? 들어오려나
    for user_id in member_ids:
        # user_id로 tab_members에 tab_id와 함께 넣어주기.
        user_id_and_tab_id = {"user_id": user_id, "tab_id": tab_id}
        TabMembersRepo.insert_tab_members(tab_members_repo, user_id_and_tab_id)


    #######################################################
    # 추가 -> 현재 채팅 기능에 초대된 사람 추가.
    # 고민해볼 것: 지금까지 대화내역들 초대된 사람한테도 보이게 할까?
    # 이건 선택할 수 있을 듯.
    #######################################################


    return

# 탭에 그룹 초대
@router.post("{workspace_id}/tabs/{tab_id}/groups")
async def invite_member_to_tab(
            workspace_id: Annotated[str, Path()],
            tab_id: Annotated[int, Path()],
            group_id: int,
            token_user_id_and_email = Depends(verify_token_and_get_token_data),
):
    # 그룹아이디를 통해서 모든 유저들 정보 가져오기.
    # 얘는 리스트 형식임.
    members = WorkspaceMemRepo.find_members_by_group_id(workspace_mem_repo, group_id)
    
    # tab_members에 초대할 멤버 + tab_id 데이터 넣기.
    for user in members:
        # user_id로 tab_members에 tab_id와 함께 넣어주기.
        user_id_and_tab_id = {"user_id": user["user_id"], "tab_id": tab_id}
        TabMembersRepo.insert_tab_members(tab_members_repo, user_id_and_tab_id)


    #######################################################
    # 추가 -> 현재 채팅 기능에 초대된 사람 추가.
    # 고민해볼 것: 지금까지 대화내역들 초대된 사람한테도 보이게 할까?
    # 이건 선택할 수 있을 듯.
    #######################################################


    return

@router.post("/{workspace_id}/users")
async def create_users(request: Request, workspace_id):
    data: dict = await request.json()
    fail_count: int = 0
    fail_list = []

    # step 1.일단 이름이랑 email 받아와서,
    # user 테이블에 겹치는 애들이 있는지 확인 -> email로만 확인해도 될 듯.
    for i in data["users"]:
        print("************************")
        print(i["email"])
        target = UserService.find_user_by_email(i["email"])
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
            print("create_user_in_usertable\n")
            UserService.create_user_in_usertable(target_data)

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
        # 만약 email이 겹치는 애들이 있다?
            # -> 그럼 id+workspace_id를 통해서 workspace_member 조회.


    #       이미 있다? -> go final (로직은 하면서 생각)
    #       없다? -> go step 3


    # step 3.
    # workspaces_member에 추가해주기.
    # 체크 - 만약 추가 중 실패했다? -> 실패한 사람꺼는 user테이블에서 삭제하진마(다른 워크스페이스랑 연결된게 있을 수도 있으니)
    #                            + 실패한 횟수 카운트 저장, 실패한 사람 이름 저장.
    # 나중에 총 실행횟수 - 실패 횟수 + 실패 횟수 + 실패한 사람 이름 반환.

    # data[0]
    # print("받은 데이터:", data)  # 콘솔에 출력
    # return {"received": True, "count": len(data.get("users", [])), "users": data.get("users", [])}


@router.get("/{workspace_id}/users")
async def create_users(request: Request):
    columns = workspace_member_service.get_member_by_workspace_columns()
    return columns