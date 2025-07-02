from pydantic import BaseModel

class AccessToken_and_RefreshToken(BaseModel):
    access_token: str
    refresh_token: str

class AccessTokenOnly(BaseModel):
    access_token: str