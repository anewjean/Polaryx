from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID


class CreateTabRequest(BaseModel):
    user_ids: List[str]
    tab_name: Optional[str] = None