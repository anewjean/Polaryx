from fastapi import APIRouter
from pydantic import BaseModel
from app.service.push import add_subscription

router = APIRouter(prefix="/push", tags=["Push"])

class SubscribeRequest(BaseModel):
    endpoint: str
    keys: dict

@router.post("/subscribe")
async def subscribe(request: SubscribeRequest):
    add_subscription(request.dict())
    return {"status": "subscribed"}