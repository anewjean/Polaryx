from fastapi.responses import HTMLResponse
from fastapi import APIRouter, HTTPException, Request, Response
from typing import Union
from enum import Enum
import os
import httpx
from urllib.parse import urlencode
from pathlib import Path
from fastapi.responses import RedirectResponse
from datetime import datetime, UTC
from uuid6 import uuid7
from jose import jwt, JWTError

from BE.app.service.auth.auth_service import AuthService, TokenSerive
from BE.app.schema.auth.auth import AccessToken_and_RefreshToken, AccessTokenOnly
    

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

@router.post("/{provider}/callback", response_model=AccessToken_and_RefreshToken)
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

            # UUID 객체 생성. 객체명은 바로 바꿀거라 중요하지 않음.
            uuid_obj1 = uuid7()
            uuid_obj2 = uuid7()
            # 16바이트 바이너리로 변환
            user_uuid = uuid_obj1.bytes
            refresh_token_uuid = uuid_obj2.bytes

            data = {"user_email": user["email"], "user_provider_id": user["id"], "user_id": user_uuid}

            # 유저 처리 로직 넣기 (DB에 존재하는 유저인가?) #
            user_INdb = AuthService.find_db(data)

            ########################################
            # 이건 개선 해야 하는 곳.
            # 회원 목록에 없다면, 관리자 문의 페이지로 이동시켜야 함.
            if not user_INdb:
                print("Failed")
                raise HTTPException(status_code=400, detail="User is not in DB")
            ########################################
            
            else:
                print(user_INdb)
                ########### #############################
                # 토큰 발급
                data = {"email": user_INdb[0][2]}
                print(data)
                
                jwt_token = TokenSerive.create_access_token(data)
                ########################################
                
                # return user
                redirect_to = f"http://localhost:3000/auth/callback?token={jwt_token}"
                return RedirectResponse(redirect_to)

                jwt_access_token = TokenSerive.create_access_token(data)
                jwt_refresh_token = TokenSerive.create_refresh_token(data)

                data={"id": refresh_token_uuid,
                      "user_id": user_INdb[0][0], 
                      "user_refresh_token": jwt_refresh_token, 
                      }
                
                TokenSerive.save_refresh_token_to_db(data)

                result = AccessToken_and_RefreshToken(access_token=jwt_access_token, refresh_token=jwt_refresh_token)
                
                return result
    # github 구현 부분. 미완.

    # elif provider.value == "github":
    #     async with httpx.AsyncClient() as client:
    #         # Step 1: access_token 요청
    #         token_res = await client.post(
    #             GITHUBS_TOKEN_URL,
    #             headers={"Accept": "application/json"},
    #             data={
    #                 "code": code,
    #                 "client_id": GITHUBS_CLIENT_ID,
    #                 "client_secret": GITHUBS_CLIENT_SECRET,
    #                 "redirect_uri": GITHUBS_REDIRECT_URI,
    #             },
    #         )
    #         token_json = token_res.json()
    #         access_token = token_json.get("access_token")

    #         if not access_token:
    #             return {"error": "Access token not received"}

    #         # Step 2: 유저 정보 요청
    #         user_res = await client.get(
    #             GITHUBS_USERINFO_URL,
    #             headers={"Authorization": f"Bearer {access_token}"}
    #         )

    #         user = user_res.json()

    #         ########################################
    #         # 유저 처리 로직 넣기 (DB에 존재하는 유저인가?) #
    #         ########################################

    #         return {"user": user}
        


# 로그아웃도 하기
@router.delete("/logout")
async def logout(request:Request, response:Response):
    
    # 로그아웃할 때도 refresh token 넣어서 보내줌.
    refresh_token = request.cookies.get("refresh_token")
    data = {"user_refresh_token": refresh_token}
    token_user_id_and_email = TokenSerive.verify_token_get_user_id_and_email(refresh_token)

    data.update({"user_id": token_user_id_and_email["user_id"], "email": token_user_id_and_email["email"]})

    # 그럼 그거 받아서 db에 있는 refresh_token 찾아서 삭제해주고
    # (삭제하려면 user_id 있어야됨. 한번 받아오기.)
    TokenSerive.delete_refresh_token_from_db(data)

    # 클라이언트에서 쿠키에 저장해놨냐?
    # 아님 스토리지에 저장해놨냐에 따라 다르게
    response.delete_cookie("refresh_token")

    return



# 로그인 유지(access token 만료)
@router.get("/refresh", response_model=AccessTokenOnly)
async def reaccess(request: Request):
    # 요청으로 refresh_token 받아오겠지?
    # 그럼 요청에서 refresh_token 찾아서
    refresh_token = request.cookies.get("refresh_token")

    if not refresh_token:
        raise HTTPException(status_code=400, detail="Refresh token 없음")

    data = {"user_refresh_token": refresh_token}

    # 그리고 validation 검사를 위해 payload 받아오고,
    token_user_id_and_email = TokenSerive.verify_token_get_user_id_and_email(data)
    
    # 그 refresh_token으로 db에서 refresh_token 찾아오기
    db_refresh_token = TokenSerive.find_and_get_refresh_token(data)
    db_token_user_id_and_email = TokenSerive.verify_token_get_user_id_and_email({"user_refresh_token": db_refresh_token})

    # ㅇㅋ 하면 새로 액세스 토큰 발급
    if token_user_id_and_email["user_id"] == db_token_user_id_and_email["user_id"]:
        new_access_token = TokenSerive.create_access_token(token_user_id_and_email)
        return AccessTokenOnly(
            access_token=new_access_token
        )
    else:
        raise HTTPException(status_code=401, detail="refresh token 불일치")
