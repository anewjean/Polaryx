from __future__ import annotations
from dataclasses import dataclass
from datetime import datetime
from typing import Optional
import uuid

@dataclass
class User:
    id: uuid.UUID = field(default_factory=uuid.uuid7)
    is_updated: bool = False
    created_at: datetime = datetime.now()
    updated_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None
