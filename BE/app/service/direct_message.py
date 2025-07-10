from typing import List
from app.repository.direct_message import DMRepository
from app.service.tab import TabService

class DMService:
    def __init__(self):
        self.repo = DMRepository()
        self.tab_service = TabService()

    def get_tab(self, user_ids: List, workspace_id: int, tab_name: str, section_id: int):
        tab = self.tab_service.find_by_unique_key(workspace_id, tab_name, section_id)
        if tab:
            return tab
        return self.tab_service.create_tab(user_ids, workspace_id, tab_name, section_id)

    def find_member_names(self, user_ids: List) -> List:
        rows = self.repo.find_member_names(user_ids)
        member_names = [row[0] for row in rows]
        return member_names