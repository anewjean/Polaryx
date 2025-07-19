from __future__ import annotations
from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

from app.domain.notification import Notification

class NotificationSchema(BaseModel):
    id: Optional[int] = None
    receiver_id: UUID
    sender_id: UUID
    tab_id: Optional[int] = None
    message_id: Optional[int] = None
    type: int
    content: str
    is_read: bool
    created_at: datetime
    read_at: Optional[datetime] = None

    @classmethod
    def from_domain(cls, n: Notification) -> "NotificationSchema":
        return cls(
            id=n.id,
            receiver_id=n.receiver_id,
            sender_id=n.sender_id,
            tab_id=n.tab_id,
            message_id=n.message_id,
            type=n.type,
            content=n.content,
            is_read=n.is_read,
            created_at=n.created_at,
            read_at=n.read_at,
        )