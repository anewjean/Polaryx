from pydantic import BaseModel

class AccessToken_and_WorkspaceID(BaseModel):
    access_token: str
    workspace_id: int

class AccessTokenOnly(BaseModel):
    access_token: str