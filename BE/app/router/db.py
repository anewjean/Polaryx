from fastapi import APIRouter
from app.service.db import DBService


router = APIRouter()
db_service = DBService()

# db 전체 테이블 초기화 후 시드데이터 삽입
@router.get("/reset")
async def reset():
    db_service.reset()
    return True