from typing import List

from app.domain.message import Message
from app.repository.message import QueryRepo as MessageRepo
from app.repository.workspace_member import QueryRepo as WorkspaceMemberRepo
from app.repository.files import QueryRepo as FilesRepo

import uuid

class MessageService:
    def __init__(self):
        self.message_repo = MessageRepo()
        self.files_repo = FilesRepo()
    
    async def save_message(self, tab_id: int, sender_id: uuid.UUID, content: str) -> None:
        message = Message.of(tab_id, sender_id, content)
        res = self.message_repo.insert(message)
        return res["lastrowid"]

    async def find_recent_messages(self, tab_id: int, before_id: int) -> List[Message]:
        return self.message_repo.find_recent_30(tab_id, before_id)

    async def find_message_by_(self, tab_id: int) -> List[Message]:
        return self.message_repo.find_all(tab_id)

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
        
    async def save_file_to_db(self, data: dict):
        self.files_repo.save_file_to_db(data)

    async def find_file_by_message_id(self, data: dict):
        self.files_repo.find_file_by_message_id(data)

    # 디버깅용 다지우기 함수
    async def delete_all_message(self):
        self.message_repo.delete_all()