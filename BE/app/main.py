# import os
# import httpx

# from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse
from urllib.parse import urlencode
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

from BE.app.router.message import websocket_controller as message
<<<<<<< HEAD
from BE.app.router.workspace_members import workspace_members_controller as workspace_members
=======
from BE.app.router.auth import auth_controller as auth
>>>>>>> e9b0c7ca12bfa256942457a0a81613c22809fbe2

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"], # 개발용 
    allow_origins=["http://43.201.21.169:3000"], # 배포용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router=message.router)
<<<<<<< HEAD
app.include_router(router=workspace_members.router)
=======
app.include_router(router=auth.router)
>>>>>>> e9b0c7ca12bfa256942457a0a81613c22809fbe2

@app.get("/ping")
async def pong():
    return {"message": "pong from backend"}
<<<<<<< HEAD

@app.get("/")
def root():
    return {"message": "Welcome to the Slack-LMS API!"}


# @app.get("/auth/google")
# def login_with_google():
#     params = {
#         "client_id": GOOGLE_CLIENT_ID,
#         "redirect_uri": GOOGLE_REDIRECT_URI,
#         "response_type": "code",
#         "scope": "openid email profile",
#         "access_type": "offline",
#         "prompt": "consent",
#     }
#     url = f"{GOOGLE_AUTH_URL}?{urlencode(params)}"
#     return RedirectResponse(url)

# @app.get("/auth/github")
# def github_login():
#     params = {
#         "client_id": GITHUB_CLIENT_ID,
#         "redirect_uri": GITHUB_REDIRECT_URI,
#         "scope": "user",
#     }
#     github_auth_url = f"https://github.com/login/oauth/authorize?{urlencode(params)}"
#     return RedirectResponse(github_auth_url)


# @app.get("/auth/callback")
# async def auth_callback(code: str):
#     async with httpx.AsyncClient() as client:
#         # Step 1: 토큰 요청
#         token_res = await client.post(GOOGLE_TOKEN_URL, data={
#             "code": code,
#             "client_id": GOOGLE_CLIENT_ID,
#             "client_secret": GOOGLE_CLIENT_SECRET,
#             "redirect_uri": GOOGLE_REDIRECT_URI,
#             "grant_type": "authorization_code"
#         })

#         token_data = token_res.json()
#         access_token = token_data.get("access_token")

#         # Step 2: 유저 정보 요청
#         userinfo_res = await client.get(
#             GOOGLE_USERINFO_URL,
#             headers={"Authorization": f"Bearer {access_token}"}
#         )

#         user = userinfo_res.json()
#         # 👇 유저 처리 로직 (로그인 or 회원가입)
#         return {"user": user}


# @app.get("/auth/github/callback")
# async def github_callback(code: str):
#     async with httpx.AsyncClient() as client:
#         # Step 1: access_token 요청
#         token_res = await client.post(
#             "https://github.com/login/oauth/access_token",
#             headers={"Accept": "application/json"},
#             data={
#                 "client_id": GITHUB_CLIENT_ID,
#                 "client_secret": GITHUB_CLIENT_SECRET,
#                 "code": code,
#                 "redirect_uri": GITHUB_REDIRECT_URI,
#             },
#         )
#         token_json = token_res.json()
#         access_token = token_json.get("access_token")

#         if not access_token:
#             return {"error": "Access token not received"}

#         # Step 2: 유저 정보 요청
#         user_res = await client.get(
#             "https://api.github.com/user",
#             headers={"Authorization": f"Bearer {access_token}"}
#         )

#         user_data = user_res.json()

#         return {
#             "github_id": user_data["id"],
#             "username": user_data["login"],
#             "avatar": user_data["avatar_url"],
#             "profile": user_data["html_url"],
#         }
=======
>>>>>>> e9b0c7ca12bfa256942457a0a81613c22809fbe2
