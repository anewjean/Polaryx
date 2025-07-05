from fastapi import APIRouter, Request

router = APIRouter(prefix="/users")

@router.post("/create")
async def create_users(request: Request):
    data = await request.json()
    print("받은 데이터:", data)  # 콘솔에 출력
    return {"received": True, "count": len(data.get("users", [])), "users": data.get("users", [])}