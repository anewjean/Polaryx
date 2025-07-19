from __future__ import annotations
import uuid
from pydantic import BaseModel
from typing import List
from datetime import datetime
from typing import Optional
from uuid import UUID


class MessageSchema(BaseModel):
    msg_id: int
    tab_id: int
    sender_id: str
    nickname: str
    image: Optional[str] = None
    content: str
    is_updated: bool
    created_at: datetime
    updated_at: datetime | None
    deleted_at: datetime | None
    file_url: Optional[str] = None
    e_check_cnt: int
    e_clap_cnt: int
    e_like_cnt: int
    my_toggle: Optional[List] = None

    @classmethod
    def from_row(cls, row: tuple) -> MessageSchema:
        res = []
        if row[14] == 1: res.append("check")
        if row[15] == 1: res.append("clap")
        if row[16] == 1: res.append("like")
        return cls(
            msg_id=row[0],
            tab_id=row[1],
            sender_id=row[2].hex(),
            nickname=row[3],
            image=row[4] or "",
            content=row[5],
            is_updated=row[6],
            created_at=row[7],
            updated_at=row[8],
            deleted_at=row[9],
            file_url=row[10] if len(row) > 10 else None,
            e_check_cnt=row[11],
            e_clap_cnt=row[12],
            e_like_cnt=row[13],
            my_toggle=res
        )


class MessagesResponse(BaseModel):
    messages: List[MessageSchema]