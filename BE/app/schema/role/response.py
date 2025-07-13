from __future__ import annotations
from pydantic import BaseModel
from typing import List

from app.domain.role import Role


class RoleResponse(BaseModel):
    id: int
    name: str
    permissions: List[str]
    
    @staticmethod
    def from_domain(role: Role) -> RoleResponse:
        return RoleResponse(
            id = role.id,
            name = role.name,
            permissions=[p.value for p in role.permissions]
        )
