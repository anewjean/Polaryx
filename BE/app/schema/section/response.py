from pydantic import BaseModel
from typing import Optional

class SectionResponse(BaseModel):
    id: int
    name: str
    workspace_id: int
    sub_id: Optional[int] = None
    sub_name: Optional[str] = None
