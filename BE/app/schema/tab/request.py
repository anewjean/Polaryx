from pydantic import BaseModel
from typing import Optional, List

class CreateTabRequest(BaseModel):
    tab_name: str
    section_id: int
    workspace_id: int

class InviteRequest(BaseModel):
    user_ids: List[str]