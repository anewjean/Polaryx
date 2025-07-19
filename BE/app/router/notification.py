
from fastapi import APIRouter
from typing import List

from app.service.notification import NotificationService
from app.schema.notification.response import NotificationSchema

router = APIRouter(prefix="/notifications", tags=["Notifications"])
service = NotificationService()

@router.get("/{user_id}", response_model=List[NotificationSchema])
async def get_notifications(user_id: str):
    notifications = service.get_notifications(user_id)
    return [NotificationSchema.from_domain(n) for n in notifications]