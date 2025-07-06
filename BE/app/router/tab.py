from fastapi import APIRouter, Path
from typing import List
from app.schema.tab.request import CreateTabRequest
from app.schema.tab.response import TabResponse
from app.service.tab import TabService

router = APIRouter()
service = TabService()

@router.post("/workspaces/{workspace_id}/tabs")
def create_tab(workspace_id: int, tab_data: CreateTabRequest):
    tab_data.workspace_id = workspace_id
    service.create_tab(tab_data)
    return {"message": "Tab created successfully."}

#  여러 개 탭 리스트 (사이드바용)
@router.get("/workspaces/{workspace_id}/tabs", response_model=List[TabResponse])
def get_tabs(workspace_id: int):
    return service.get_tabs(workspace_id)

#  단일 탭 상세 정보
@router.get("/workspaces/{workspace_id}/tabs/{tab_id}", response_model=TabResponse)
def get_tab(workspace_id: int, tab_id: int):
    return service.get_tab(workspace_id, tab_id)
