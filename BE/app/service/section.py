from typing import List
from app.domain.section import Section
from app.repository.section import SectionQueryRepo

class SectionService:
    def __init__(self):
        self.repo = SectionQueryRepo()

    def get_sections_by_workspace(self, workspace_id: int) -> List[Section]:
        return self.repo.find_all_by_workspace(workspace_id)
