from pydantic import BaseModel, EmailStr
from typing import Optional

class WorkspaceMemberSchema(BaseModel):
    id: str
    user_id: str
    workspace_id: Optional[int] = None
    nickname: str
    email: EmailStr
    github: Optional[str]
    blog: Optional[str]
    image: Optional[str] = None
    phone: Optional[str] = None

    @classmethod
    def from_row(cls, row: tuple) -> "WorkspaceMemberSchema":
        return cls(
            id=row[0].hex() if isinstance(row[0], bytes) else row[0],
            user_id=row[1].hex() if isinstance(row[1], bytes) else row[1],
            workspace_id=row[2],
            nickname=row[3],
            email=row[4],
            github=row[5],
            blog=row[6],
            image=row[7],
            phone=row[8],
        )

class WorkspaceMemberResponse(BaseModel):
    workspace_member: WorkspaceMemberSchema
