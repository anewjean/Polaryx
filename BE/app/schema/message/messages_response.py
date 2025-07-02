from __future__ import annotations
import uuid
from pydantic import BaseModel
from typing import List
from datetime import datetime


class MessageSchema(BaseModel):
    id: int
    tab_id: int
    sender_id: uuid.UUID
    nickname: str
    content: str
    is_updated: bool
    created_at: datetime
    updated_at: datetime | None
    deleted_at: datetime | None

    @classmethod
    def from_row(cls, row: tuple) -> MessageSchema:
        return cls(
            id=row[0],
            tab_id=row[1],
            sender_id=row[2],
            nickname=row[3],
            content=row[4],
            is_updated=row[5],
            created_at=row[6],
            updated_at=row[7],
            deleted_at=row[8],
        )


class MessagesResponse(BaseModel):
    messages: List[MessageSchema]