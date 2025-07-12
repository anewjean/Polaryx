from __future__ import annotations
import uuid
from pydantic import BaseModel
from typing import List
from datetime import datetime
from typing import Optional


class MessageSchema(BaseModel):
    msgId: int
    tabId: int
    senderId: uuid.UUID
    nickname: str
    image: Optional[str] = None
    content: str
    isUpdated: bool
    createdAt: datetime
    updatedAt: datetime | None
    deletedAt: datetime | None
    fileUrl: Optional[str] = None

    @classmethod
    def from_row(cls, row: tuple) -> MessageSchema:
        return cls(
            msgId=row[0],
            tabId=row[1],
            senderId=row[2],
            nickname=row[3],
            image=row[4] or "",
            content=row[5],
            isUpdated=row[6],
            createdAt=row[7],
            updatedAt=row[8],
            deletedAt=row[9],
            fileUrl=row[10] if len(row) > 10 else None,
        )


class MessagesResponse(BaseModel):
    messages: List[MessageSchema]