from fastapi.responses import HTMLResponse
from fastapi import APIRouter
from typing import Union
from enum import Enum
import os
import httpx
from urllib.parse import urlencode
from pathlib import Path
from fastapi.responses import RedirectResponse

from BE.app.service.auth.auth_service import AuthService, TokenSerive


router = APIRouter(prefix="/auth")

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")
GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"

GITHUBS_CLIENT_ID = os.getenv("GITHUBS_CLIENT_ID")
GITHUBS_CLIENT_SECRET = os.getenv("GITHUBS_CLIENT_SECRET")
GITHUBS_REDIRECT_URI = os.getenv("GITHUBS_REDIRECT_URI")
GITHUBS_AUTH_URL = "https://github.com/login/oauth/authorize"
GITHUBS_TOKEN_URL = "https://github.com/login/oauth/access_token"
GITHUBS_USERINFO_URL = "https://api.github.com/user"

class Provider(str, Enum):
    google = "google"
    github = "github"

google_params = {
    "client_id": GOOGLE_CLIENT_ID,
    "redirect_uri": GOOGLE_REDIRECT_URI,
    "response_type": "code",
    "scope": "openid email profile",
    "access_type": "offline",
    "prompt": "consent",
}

GITHUBS_params = {
    "client_id": GITHUBS_CLIENT_ID,
    "redirect_uri": GITHUBS_REDIRECT_URI,
    "scope": "user",
}

@router.get("/{provider}")
def social_login(provider: Provider):

    if provider.value == "google":
        params = google_params
        url = f"{GOOGLE_AUTH_URL}?{urlencode(params)}"

    elif provider.value == "github":
        params = GITHUBS_params
        url = f"{GITHUBS_AUTH_URL}?{urlencode(params)}"

    return RedirectResponse(url)

@router.get("/{provider}/callback")
async def auth_callback(provider: Provider, code: str):
    
    user = None

    if provider.value == "google":
        async with httpx.AsyncClient() as client:
            # Step 1: 토큰 요청
            token_res = await client.post(GOOGLE_TOKEN_URL, data={
                "code": code,
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uri": GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code"
            })

            token_data = token_res.json()
            access_token = token_data.get("access_token")

            if not access_token:
                return {"error": "Access token not received"}
            
            # Step 2: 유저 정보 요청
            userinfo_res = await client.get(
                GOOGLE_USERINFO_URL,
                headers={"Authorization": f"Bearer {access_token}"}
            )

            user = userinfo_res.json()

            print(user)

            ########################################
            # 유저 처리 로직 넣기 (DB에 존재하는 유저인가?) #
            user_INdb = AuthService.find_db(user["email"])
            ########################################

            if user_INdb is None:
                print("Failed")
                return

            else:
                print(user_INdb)
                ########### #############################
                # 토큰 발급
                data = {"email": user_INdb[0][2]}
                print(data)
                
                jwt_token = TokenSerive.create_access_token(data)
                ########################################
                
                # return user
                return {"access_token": jwt_token, "token_type": "bearer"}

    elif provider.value == "github":
        async with httpx.AsyncClient() as client:
            # Step 1: access_token 요청
            token_res = await client.post(
                GITHUBS_TOKEN_URL,
                headers={"Accept": "application/json"},
                data={
                    "code": code,
                    "client_id": GITHUBS_CLIENT_ID,
                    "client_secret": GITHUBS_CLIENT_SECRET,
                    "redirect_uri": GITHUBS_REDIRECT_URI,
                },
            )
            token_json = token_res.json()
            access_token = token_json.get("access_token")

            if not access_token:
                return {"error": "Access token not received"}

            # Step 2: 유저 정보 요청
            user_res = await client.get(
                GITHUBS_USERINFO_URL,
                headers={"Authorization": f"Bearer {access_token}"}
            )

            user = user_res.json()

            ########################################
            # 유저 처리 로직 넣기 (DB에 존재하는 유저인가?) #
            ########################################

            return {"user": user}
        

# JWT 발급


# 로그아웃도 하기
@router.get("/logout")
async def logout(refresh_token):
    refresh_token




# 로그인 유지도 하기
        

# 로그인