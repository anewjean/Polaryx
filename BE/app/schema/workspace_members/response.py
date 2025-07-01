from pydantic import BaseModel, EmailStr
from typing import Optional

class WorkspaceMemberResponse(BaseModel):
    id: str
    nickname: str
    email: EmailStr
    github: Optional[str]
    blog: Optional[str]
    image: Optional[str]
    
    
