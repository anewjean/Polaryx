from __future__ import annotations
from dataclasses import dataclass
from datetime import datetime
from typing import Optional
import uuid

@dataclass
class Notification:
    id: Optional[int] = None
    receiver_id: uuid.UUID | None = None
    sender_id: uuid.UUID | None = None
    tab_id: Optional[int] = None
    message_id: Optional[int] = None
    type: int = 0
    content: str = ""
    is_read: bool = False
    created_at: datetime = datetime.now()
    read_at: Optional[datetime] = None

    @classmethod
    def from_row(cls, row: tuple) -> "Notification":
        return cls(
            id=row[0],
            receiver_id=uuid.UUID(bytes=row[1]) if isinstance(row[1], bytes) else row[1],
            sender_id=uuid.UUID(bytes=row[2]) if isinstance(row[2], bytes) else row[2],
            tab_id=row[3],
            message_id=row[4],
            type=row[5],
            content=row[6],
            is_read=row[7],
            created_at=row[8],
            read_at=row[9],
        )