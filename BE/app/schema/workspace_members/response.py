from pydantic import BaseModel, EmailStr
from typing import Optional

class WorkspaceMemberResponse(BaseModel):
    id: str
    user_id: str
    nickname: str
    email: EmailStr
    github: Optional[str]
    blog: Optional[str]
    image: Optional[str]
    phone: Optional[str] | None = None
    
    
