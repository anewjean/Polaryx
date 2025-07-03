from __future__ import annotations
from dataclasses import dataclass, field
import uuid

@dataclass
class TabMembers:
    id: uuid.UUID = field(default_factory=uuid.uuid4)
    tab_id: int
    user_id: uuid.UUID