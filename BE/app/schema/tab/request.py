from pydantic import BaseModel
from typing import Optional, List

class CreateTabRequest(BaseModel):
    name: str
    workspace_id: int
    section_id: int
    sub_section_id: Optional[int] = None


class InviteRequest(BaseModel):
    user_ids: List[str]