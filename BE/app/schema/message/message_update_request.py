from pydantic import BaseModel
from uuid import UUID


class MessageUpdateRequest(BaseModel):
    sender_id: UUID
    new_content: str