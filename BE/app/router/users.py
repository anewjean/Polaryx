from fastapi import APIRouter, Request
from app.service.users import UserService
from app.service.workspace_member import WorkspaceMemberService
import uuid

router = APIRouter(prefix="/users")

@router.post("/")
async def create_users(request: Request):
    data: list = await request.json()
    fail_count: int = 0
    fail_list = [str]

    # step 1.일단 이름이랑 email 받아와서,
    # user 테이블에 겹치는 애들이 있는지 확인 -> email로만 확인해도 될 듯.
    for i in data:
        target = UserService.find_user_by_email(i["email"])

        # email이 안겹친다면? user 테이블에 정보 추가 및 생성.
        # 생성 하면서 user id 만들어주기.
        if not target:
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

            # 잘 들어갔는지 확인.
            target = UserService.find_user_by_email(target_data)
            # user가 안만들어졌다? -> error
            if not target:
                print("\nerror\n")
                fail_count += 1
                fail_list.append(i["name"])
                continue

        target_user_id = target[0][0]
        target_in_wm = WorkspaceMemberService.get_member_by_user_id(target_user_id)
            
        if not target_in_wm:
            # 잘 만들어졋따? workspaces_member에 추가해주기.
            # ----- 아마 target 리스트일텐데 일단 고.
            WorkspaceMemberService.insert_workspace_member(target)
            
            # 잘 들어갔는지 확인.
            target_in_wm = WorkspaceMemberService.get_member_by_user_id(target_user_id)
            if not target_in_wm:
                print("\nerror\n")
                fail_count += 1
                fail_list.append(i["name"])

    result = {
        "success_count": data.count() - fail_count,
        "fail_user_name": list
    }
    result["fail_user_name"].append(fail_list)

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


@router.get("/")
async def create_users(request: Request):
    print(1)