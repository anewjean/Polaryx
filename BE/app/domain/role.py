from __future__ import annotations
from dataclasses import dataclass, field
from enum import Enum
from typing import List, Optional
from datetime import datetime

class PermissionType(str, Enum):
    ANNOUNCE = "announce"
    COURSE = "course"
    CHANNEL = "channel"

@dataclass
class Role:
    id: Optional[int] = None
    name: str = ""
    workspace_id: int = 0
    permissions: List[PermissionType] = field(default_factory=set)
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None

    @classmethod
    def from_row(cls, row: tuple) -> Role:
        permissions = [
            PermissionType.ANNOUNCE if row[3] else None,
            PermissionType.COURSE if row[4] else None, 
            PermissionType.CHANNEL if row[5] else None
        ]
        return cls(
            id=row[0],
            name=row[1],
            workspace_id=row[2],
            permissions=[p for p in permissions if p],
            created_at=row[6],
            updated_at=row[7],
            deleted_at=row[8]
        )
