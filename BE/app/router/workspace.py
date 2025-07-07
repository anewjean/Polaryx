from fastapi import APIRouter
from app.schema.workspace.response import WorkspaceNameSchema
from app.service.workspace import WorkspaceService

router = APIRouter(prefix="/api/workspaces")
service = WorkspaceService()

@router.get("/{workspace_id}/title", response_model=WorkspaceNameSchema)
def get_workspace_info(workspace_id: int):
    row = service.get_workspace_info(workspace_id)
    return WorkspaceNameSchema.from_row(row)
