from __future__ import annotations
from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class Workspace:
    id: int
    name: str
    created_at: datetime = datetime.now()
    updated_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None
