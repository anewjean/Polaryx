from pydantic import BaseModel


class MessageUpdateRequest(BaseModel):
    # message_id: int
    # sender_id: str
    new_content: str