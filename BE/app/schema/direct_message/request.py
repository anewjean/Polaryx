from pydantic import BaseModel
from typing import Optional, List


class CreateTabRequest(BaseModel):
    user_ids: List[str]
    user_id: str