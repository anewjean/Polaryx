from app.repository.workspace import QueryRepo as WorkspaceRepo


class WorkspaceService:
    def __init__(self):
        self.workspace_repo = WorkspaceRepo()

    def get_workspace_info(self, workspace_id: int):
        rows = self.workspace_repo.find_by_id(workspace_id)
        return rows[0] if rows else None
