from pydantic import BaseModel
from typing import Optional

class SectionCreateRequest(BaseModel):
    workspace_id: int
    name: str
    sub_id: Optional[int] = None
    sub_name: Optional[str] = None
#아직은 불필요?
