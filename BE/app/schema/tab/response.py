from __future__ import annotations
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TabResponse(BaseModel):
    id: int
    name: str
    workspace_id: int
    section_id: int
    sub_section_id: Optional[int]
    created_at: datetime
    updated_at: Optional[datetime]
    deleted_at: Optional[datetime]

    @classmethod
    def from_row(cls, row: tuple) -> TabResponse:
        return cls(
            id=row[0],
            name=row[1],
            workspace_id=row[2],
            section_id=row[3],
            sub_section_id=row[4],
            created_at=row[5],
            updated_at=row[6],
            deleted_at=row[7],
        )

class TabListItemResponse(BaseModel):
    tab_id: int
    tab_name: str
    section_id: int
    section_name: str
    subsection_id: Optional[int] = None
    subsection_name: Optional[str] = None

    @classmethod
    def from_row(cls, row: tuple) -> "TabListItemResponse":
        return cls(
            tab_id=row[0],
            tab_name=row[1],
            section_id=row[2],
            section_name=row[3],
            subsection_id=row[4],
            subsection_name=row[5],
        )