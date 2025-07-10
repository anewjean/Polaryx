from fastapi import APIRouter
from pydantic import BaseModel
from app.service.push import add_subscription

router = APIRouter(prefix="/push", tags=["Push"])

class SubscribeRequest(BaseModel):
    user_id: str
    subscription: dict

@router.post("/subscribe")
async def subscribe(request: SubscribeRequest):
    add_subscription(request.user_id, request.subscription)
    return {"status": "subscribed"}