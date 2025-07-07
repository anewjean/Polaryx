from dataclasses import dataclass
from typing import Optional

@dataclass
class Section:
    id: int
    name: str
    workspace_id: int
    sub_id: Optional[int] = None
    sub_name: Optional[str] = None

    @classmethod
    def from_row(cls, row: tuple) -> "Section":
        return cls(
            id=row[0],
            name=row[1],
            workspace_id=row[2],
            sub_id=row[3],
            sub_name=row[4]
        )
