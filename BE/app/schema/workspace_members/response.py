from pydantic import BaseModel, EmailStr
from typing import Optional

class WorkspaceMemberSchema(BaseModel):
    id: str
    user_id: str
    nickname: str
    email: EmailStr
    github: Optional[str]
    blog: Optional[str]
    image: Optional[str] = None
    phone: Optional[str] = None
    

    @classmethod
    def from_row(cls, row: tuple) -> "WorkspaceMemberResponse":
        return cls(
            id=row[0],
            user_id=row[1],
            nickname=row[2],
            email=row[3],
            github=row[4],
            blog=row[5],
            image=row[6],
            phone=row[7]
        )
        
class WorkspaceMemberResponse(BaseModel):
    workspace_member: WorkspaceMemberSchema 

    
    
