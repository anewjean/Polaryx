from __future__ import annotations
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class TabInfo(BaseModel):
    tab_id: str
    tab_name: str
    section_id: str
    section_name: str
    subsection_id: Optional[str]
    sub_section_name: Optional[str]

    @classmethod
    def from_row(cls, row: tuple) -> TabInfo:
        return cls(
            tab_id=row[0],
            tab_name=row[1],
            section_id=row[2],
            section_name=row[3],
            sub_section_id=row[4],
            sub_section_name=row[5]
        )


class TabDetailInfo(BaseModel):
    tab_id: str
    tab_name: str
    section_id: str
    section_name: str
    subsection_id: Optional[str]
    sub_section_name: Optional[str]
    members_count: int

    @classmethod
    def from_rows(cls, rows: List[tuple]) -> TabDetailInfo:
        members_count = len(rows)
        row = rows[0]
        return cls(
            tab_id=row[0],
            tab_name=row[1],
            section_id=row[2],
            section_name=row[3],
            sub_section_id=row[4],
            sub_section_name=row[5],
            members_count=members_count
        )


class TabMember(BaseModel):
    user_id: UUID
    nickname: str
    image: Optional[str]
    role: str
    groups: List[str]

    @classmethod
    def from_row(cls, row: tuple) -> TabMember:
        return cls(
            user_id=row[0],
            nickname=row[1],
            image=row[2],
            role=row[3],
            groups=[row[4]]
        )

class TabInvitation(BaseModel):
    members_count: int
    nicknames: List[str]

    @classmethod
    def from_rows(cls, rows: List[tuple]) -> TabInvitation:
        members_count = len(rows)
        return cls(
            members_count=members_count,
            nicknames=[row[0] for row in rows]
        )