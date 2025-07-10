from pydantic import BaseModel


class MessageUpdateRequest(BaseModel):
    sender_id: str
    new_content: str