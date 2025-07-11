from pydantic import BaseModel
from uuid import UUID


class MessageUpdateRequest(BaseModel):
    # sender_id: UUID
    # message_id: int
    new_content: str