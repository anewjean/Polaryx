from pydantic import BaseModel
from uuid import UUID


class MessageUpdateRequest(BaseModel):
    # message_id: int
    # sender_id: str
    new_content: str