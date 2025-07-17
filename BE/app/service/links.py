from uuid import UUID, uuid4
from typing import List

from app.repository.links import QueryRepo as LinkRepo
from app.schema.links.response import (
    LinkSchema,
)
link_repo = LinkRepo()

class LinkService:
    def __init__(self):
        self.link_repo = link_repo

    # 링크 리스트 조회
    def find_all_list_at_tab(self, workspace_id: int, tab_id: int) -> List[LinkSchema]:
        rows = self.link_repo.find_all_list_at_tab(workspace_id, tab_id)
        res = [LinkSchema.from_row(row) for row in rows]
        print("find_all_list_at_tab, res: ", res)
        return res

    # 링크 추가
    def insert_link(self, workspace_id: int, tab_id: int, link_url: str, link_name: str, favicon: str, user_id: str):
        return self.link_repo.insert_link(workspace_id, tab_id, link_url, link_name, favicon, user_id)

    # 링크 삭제
    def delete_link(self, workspace_id: int, tab_id: int, link_id: str):
        return self.link_repo.delete_link(workspace_id, tab_id, link_id)

