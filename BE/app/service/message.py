from typing import List

from app.domain.message import Message
from app.repository.message import QueryRepo as MessageRepo
from app.repository.workspace_member import QueryRepo as WorkspaceMemberRepo
import uuid

class MessageService:
    def __init__(self):
        self.message_repo = MessageRepo()
    
    async def save_message(self, tab_id: int, sender_id: uuid.UUID, content: str) -> None:
        message = Message.of(tab_id, sender_id, content)
        self.message_repo.insert(message)

    async def find_all_messages(self, tab_id: int) -> List[Message]:
        return self.message_repo.find_all(tab_id)

    async def modify_message(self, message_id: int, new_content: str):
        row = self.message_repo.find_by_id(message_id)[0]
        message = Message.from_row(row)
        message.modify(new_content)
        self.message_repo.update(message)

    async def delete_message(self, message_id: int):
        row = self.message_repo.find_by_id(message_id)[0]
        message = Message.from_row(row)
        message.delete()
        self.message_repo.update(message)
        
    # 디버깅용 다지우기 함수
    async def delete_all_message(self):
        self.message_repo.delete_all()