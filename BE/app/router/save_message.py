from fastapi import APIRouter, Depends, Query
from app.schema.request import SaveMessageCreate
from app.schema.response import SaveMessageSchema
from app.service.save_message import SaveMessageService
from app.util.auth import get_current_user
from typing import List

router = APIRouter()
service = SaveMessageService()

@router.post("/save-messages")
async def save_message(req: SaveMessageCreate, current_user = Depends(get_current_user)):
    ...

@router.get("/save-messages", response_model=List[SaveMessageSchema])
async def get_saved_messages(workspace_id: int = Query(...), current_user = Depends(get_current_user)):
    ...

@router.delete("/save-messages/{message_id}")
async def delete_saved_message(message_id: int, current_user = Depends(get_current_user)):
    ...
