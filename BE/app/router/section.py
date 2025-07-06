from fastapi import APIRouter
from typing import List
from app.schema.section.response import SectionResponse
from app.service.section import SectionService

router = APIRouter(prefix="/sections", tags=["Section"])
service = SectionService()

@router.get("/{workspace_id}", response_model=List[SectionResponse])
def get_sections(workspace_id: int):
    sections = service.get_sections_by_workspace(workspace_id)
    return sections
