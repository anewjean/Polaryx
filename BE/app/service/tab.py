from typing import List
from BE.app.schema.tab.request import CreateTabRequest
from BE.app.schema.tab.response import TabResponse
from BE.app.repository.tab import TabRepository
from fastapi import HTTPException

class TabService:
    def __init__(self):
        self.repo = TabRepository()

    def create_tab(self, tab_data: CreateTabRequest):
     is_valid = self.repo.validate_section_in_workspace(tab_data.section_id, tab_data.workspace_id)
     if not is_valid:
        raise HTTPException(status_code=400, detail="섹션이 이 워크스페이스에 속하지 않습니다.")

     self.repo.create_tab(tab_data.dict())


    def get_tabs(self, workspace_id: int) -> List[TabResponse]:
        rows = self.repo.get_tabs_by_workspace_id(workspace_id)
        return [TabResponse.from_row(row) for row in rows]
    
    def get_tab(self, workspace_id: int, tab_id: int) -> TabResponse:
        rows = self.repo.get_tabs_by_workspace_id(workspace_id)
        for row in rows:
            if row[0] == tab_id:
                return TabResponse.from_row(row)
