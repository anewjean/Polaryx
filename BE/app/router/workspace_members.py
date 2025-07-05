from fastapi import APIRouter

from app.service.workspace_member import WorkspaceMemberService

router = APIRouter()
workspace_member_service = WorkspaceMemberService()

@router.get("/api/workspaces/1/users")
async def get_workspace_columns():
    columns = workspace_member_service.get_member_by_workspace_columns()
    return {"columns": columns}