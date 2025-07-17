from typing import List
from app.repository.tab import TabRepository
from fastapi import HTTPException
from app.schema.tab.response import TabMember

# 탭 퇴장시 시스템 메세지를 위한 websocket_manager
from app.service.websocket_manager import ConnectionManager
from app.service.message import MessageService
from uuid import UUID

connection = ConnectionManager()
message_service = MessageService()

class TabService:
    def __init__(self):
        self.repo = TabRepository()

    def is_tab_name_duplicate(self, workspace_id: int, section_id:int, name: str):
        return self.repo.is_duplicate(workspace_id, section_id, name)

    def create_tab(self, user_ids: List, workspace_id: int, tab_name: str, section_id: int):
        is_valid = self.repo.validate_section_in_workspace(section_id, workspace_id)
        if not is_valid:
            raise HTTPException(status_code=400, detail="섹션이 이 워크스페이스에 속하지 않습니다.")
        self.insert_tab(workspace_id, tab_name, section_id)
        rows = self.find_by_unique_key(workspace_id, tab_name, section_id)
        tab_id = rows[0][0]
        self.invite_members(workspace_id, tab_id, user_ids)
        return rows[0]

    def insert_tab(self, workspace_id: int, tab_name: str, section_id: int):
        return self.repo.insert(workspace_id, tab_name, section_id)

    def find_tabs(self, workspace_id: int, user_id):
        return self.repo.find_all(workspace_id, user_id)
        
    def find_tab(self, workspace_id: int, tab_id: int):
        return self.repo.find(workspace_id, tab_id)
    
    def find_by_unique_key(self, workspace_id: int, tab_name: str, section_id: int):
        return self.repo.find_by_uq(workspace_id, tab_name, section_id)

    def get_tab_members(self, workspace_id: int, tab_id: int): 
        return self.repo.find_members(workspace_id, tab_id)

    def get_available_tab_members(self, workspace_id: int, tab_id: int):
        return self.repo.find_non_members(workspace_id, tab_id)

    def invite_members(self, workspace_id: int, tab_id: int, user_ids: List[str]):
        return self.repo.insert_members(workspace_id, tab_id, user_ids)
    
    async def exit_tab(self, workspace_id: int, tab_id: int, user_ids: List[str]):
        users = self.repo.exit_members(workspace_id, tab_id, user_ids)
        users.sort()
        for user in users:
            print("in exit_tab, user_names: ", user[0])
            # [0]: nickname, [1]: user_id, [2]: tab_name
            await connection.broadcast(workspace_id, tab_id, f"<p style='color: gray'>{user[0]}님이 {user[2]}에서 나갔습니다.</p>")
            await message_service.save_message(tab_id, 
                                               UUID(user[1]), 
                                               f"<p style='color: gray'>{user[0]}님이 {user[2]}에서 나갔습니다.</p>", 
                                               None)
        return len(users)
    