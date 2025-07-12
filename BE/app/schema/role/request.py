from pydantic import BaseModel
from typing import List

class CreateRoleRequest(BaseModel):
    name: str
    permissions: List
    
    
class ModifyRoleRequest(BaseModel):
    name: str
    permissions: List
    
    
class DeleteRoleRequest(BaseModel):
    name: str