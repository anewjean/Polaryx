from pydantic import BaseModel
from typing import List

class WorkspaceNameSchema(BaseModel):
    workspace_id: int
    workspace_name: str

    @classmethod 
    def from_row(cls, row: tuple) -> "WorkspaceNameSchema":
        return cls(
            workspace_id=row[0],
            workspace_name=row[1]
        )

class InsertWorkspaceSchema(BaseModel):
    success_count: int
    fail_user_name: List[str]

    @classmethod 
    def from_dict(cls, dict: dict) -> "InsertWorkspaceSchema":
        return cls(
            success_count=dict["success_count"],
            fail_user_name=dict["fail_user_name"]
        )


class MemberInfo(BaseModel):
    user_name: str
    email: str
    image: str | None
    role_name: str


class WorkspaceMembersSchema(BaseModel):
    mem_infos: List[MemberInfo]

    @classmethod 
    def from_row(cls, rows: List[tuple]) -> "WorkspaceMembersSchema":
        return cls(
            mem_infos=[
                MemberInfo(
                    user_name=row[0],
                    email=row[1],
                    image=row[2],
                    role_name=row[3]
                )
                for row in rows
            ]
        )
