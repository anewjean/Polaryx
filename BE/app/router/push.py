from fastapi import APIRouter
from pydantic import BaseModel
from app.service.push import PushService

router = APIRouter(prefix="/push", tags=["Push"])
push_service = PushService()

class SubscribeRequest(BaseModel):
    user_id: str
    subscription: dict

@router.post("/subscribe")
async def subscribe(request: SubscribeRequest):
    push_service.add_subscription(request.user_id, request.subscription)

    return {"status": "subscribed"}