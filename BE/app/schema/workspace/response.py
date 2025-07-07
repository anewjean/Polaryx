from pydantic import BaseModel

class WorkspaceNameSchema(BaseModel):
    workspace_id: int
    workspace_name: str

    @classmethod 
    def from_row(cls, row: tuple) -> "WorkspaceNameSchema":
        return cls(
            workspace_id=row[0],
            workspace_name=row[1]
        )
