from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse
from urllib.parse import urlencode
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

from app.router import message
from app.router.auth import auth_controller as auth
from app.router import workspaceid as workspaces
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://43.201.21.169:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router=message.router, prefix="/api")
app.include_router(router=auth.router, prefix="/api")
app.include_router(router=workspaces.router, prefix="/api")

@app.get("/ping")
async def pong():
    return {"message": "pong from backend"}
