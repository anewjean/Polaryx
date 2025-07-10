from __future__ import annotations
import uuid
from pydantic import BaseModel
from typing import List
from datetime import datetime
from typing import Optional


class MessageSchema(BaseModel):
    id: int
    tab_id: int
    sender_id: uuid.UUID
    nickname: str
    image: Optional[str] = None
    content: str
    is_updated: bool
    created_at: datetime
    updated_at: datetime | None
    deleted_at: datetime | None
    file_url: Optional[str] = None

    @classmethod
    def from_row(cls, row: tuple) -> MessageSchema:
        return cls(
            id=row[0],
            tab_id=row[1],
            sender_id=row[2],
            nickname=row[3],
            image=row[4] or "",
            content=row[5],
            is_updated=row[6],
            created_at=row[7],
            updated_at=row[8],
            deleted_at=row[9],
            file_url=row[10] if len(row) > 10 else None,
        )


class MessagesResponse(BaseModel):
    messages: List[MessageSchema]