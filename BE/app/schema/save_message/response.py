from pydantic import BaseModel
from datetime import datetime

class SaveMessageSchema(BaseModel):
    id: int
    content: str
    created_at: datetime
