from __future__ import annotations
from pydantic import BaseModel
from typing import Optional, List


class CreateTabResponse(BaseModel):
    tab_id: int

    @classmethod
    def from_row(cls, row: tuple) -> TabInfo:
        return cls(
            tab_id=row[0]
        )
