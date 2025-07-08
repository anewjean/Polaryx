from typing import List
from app.repository.direct_message import DMRepository

class DMService:
    def __init__(self):
        self.repo = DMRepository()

    def find_member_names(self, user_ids: List) -> List:
        rows = self.repo.find_member_names(user_ids)
        member_names = [row[0] for row in rows]
        return member_names