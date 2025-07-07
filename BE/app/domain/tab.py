from __future__ import annotations
from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class Tab:
    id: int
    name: str
    workspace_id: int
    section_id: int
    sub_section_id: Optional[int]
    created_at: datetime
    updated_at: Optional[datetime]
    deleted_at: Optional[datetime]

    @staticmethod
    def of():
        pass

    @classmethod
    def from_row(cls, row: tuple) -> Tab:
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
