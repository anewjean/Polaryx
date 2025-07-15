from typing import List
from uuid import UUID

from app.util.database.abstract_query_repo import AbstractQueryRepo
from app.util.database.db_factory import DBFactory
from app.domain.message import Message, MessageUpdateType
from datetime import datetime
from fastapi import HTTPException

insert_message = """
INSERT INTO messages (
    tab_id,
    sender_id,
    content,
    url
)
VALUES (
    %(tab_id)s,
    %(sender_id)s,
    %(content)s,
    %(url)s
);
"""

update_message = """
UPDATE messages
SET 
    content = %(new_content)s,
    is_updated = 1
WHERE id = %(message_id)s
  AND sender_id = %(current_user_id)s -- 권한 검증
  AND deleted_at IS NULL;
"""

delete_message = """
UPDATE messages
SET 
    deleted_at = %(deleted_at)s
WHERE id = %(message_id)s
  AND sender_id = %(current_user_id)s
  AND deleted_at IS NULL;
"""

find_message = """
SELECT 
    id, tab_id, sender_id, content, 
    is_updated, created_at, updated_at, deleted_at, url
FROM messages 
WHERE id = %(id)s;
"""

find_all_messages = """
SELECT 
    m.id,
    m.tab_id,
    m.sender_id,
    wm.nickname,
    wm.image,
    m.content,
    m.is_updated,
    m.created_at,
    m.updated_at,
    m.deleted_at,
    m.url
FROM messages m
JOIN workspace_members wm
ON m.sender_id = wm.user_id
WHERE m.tab_id = %(tab_id)s
AND m.deleted_at IS NULL;
"""

# 페이징
find_recent_30_latest = """
SELECT 
    m.id,
    m.tab_id,
    m.sender_id,
    wm.nickname,
    wm.image,
    m.content,
    m.is_updated,
    m.created_at,
    m.updated_at,
    m.deleted_at,
    m.url
FROM messages m
JOIN workspace_members wm
ON m.sender_id = wm.user_id
WHERE m.tab_id = %(tab_id)s
AND m.deleted_at IS NULL
ORDER BY m.id DESC
LIMIT 30;
"""



find_recent_30_before = """
SELECT 
    m.id,
    m.tab_id,
    m.sender_id,
    wm.nickname,
    wm.image,
    m.content,
    m.is_updated,
    m.created_at,
    m.updated_at,
    m.deleted_at,
    m.url
FROM messages m
JOIN workspace_members wm
ON m.sender_id = wm.user_id
WHERE m.tab_id = %(tab_id)s
AND m.id < %(message_id)s
AND m.deleted_at IS NULL
ORDER BY m.id DESC
LIMIT 30;
"""

# 디버깅용
delete_all_message = """
DELETE FROM messages
WHERE id > 0;
"""

#검색
search_messages_by_keyword = """
SELECT
    m.id,
    m.tab_id,
    m.sender_id,
    wm.nickname,
    wm.image,
    m.content,
    m.is_updated,
    m.created_at,
    m.updated_at,
    m.deleted_at,
    m.url
FROM messages m
JOIN workspace_members wm ON m.sender_id = wm.user_id
WHERE m.tab_id = %(tab_id)s
  AND m.deleted_at IS NULL
  AND m.content LIKE %(pattern)s
ORDER BY m.id DESC;
"""


class QueryRepo(AbstractQueryRepo):
    def __init__(self):
        db = DBFactory.get_db("MySQL")
        super().__init__(db)
    
    def find_by_id(self, id: int) -> Message:
        param = {
            "id": id
        }
        return self.db.execute(find_message, param)

    def find_all(self, tab_id: int) -> List[Message]:
        param = {
            "tab_id": tab_id
        }
        return self.db.execute(find_all_messages, param)

    def find_recent_30(self, tab_id: int, before_id: int | None) -> List[Message]:
        print("before_id: ", before_id)
        if before_id == None:
            param = {
                "tab_id": tab_id, 
            }
            return self.db.execute(find_recent_30_latest, param)
        else:
            param = {
                "tab_id": tab_id, 
                "message_id": before_id
            }
            return self.db.execute(find_recent_30_before, param)

    def insert(self, message: Message):
        # sender_id가 이미 UUID라면 변환하지 않고, str이면 UUID로 변환
        sender_id = message.sender_id
        if isinstance(sender_id, UUID):
            sender_id_bytes = sender_id.bytes
        else:
            sender_id_bytes = UUID(str(sender_id)).bytes
        params = {
            "tab_id": message.tab_id,
            "sender_id": sender_id_bytes,
            "content": message.content,
            "url": message.file_url
        }
        return self.db.execute(insert_message, params)
    
    def update_message_content(self, message_id: int, new_content: str, current_user_id: str):
        params = {
            "message_id": message_id, 
            "new_content": new_content,
            "current_user_id": UUID(current_user_id).bytes
        }
        result = self.db.execute(update_message, params)
        
        if result["rowcount"] == 0:
            raise HTTPException(
            status_code=403, 
            detail="메시지 수정 권한이 없거나 메시지를 찾을 수 없습니다"
        )
        return result

    def delete_message_by_id(self, message_id: int, current_user_id: str):
        params = {
            "message_id": message_id,
            "deleted_at": datetime.now(),
            "current_user_id": UUID(current_user_id).bytes  # 권한 검증용
        }
        result = self.db.execute(delete_message, params)
        if result["rowcount"] == 0:
            raise HTTPException(
            status_code=403, 
            detail="메시지 삭제 권한이 없거나 메시지를 찾을 수 없습니다"
        )
        return result["rowcount"]
    
    def delete_all(self):
        print("delete_all_message")
        return self.db.execute(delete_all_message)
    
    
    
    def search_messages(self, tab_id: int, keyword: str):
        param = {
            "tab_id": tab_id,
            "pattern": f"%{keyword}%",
        }
        return self.db.execute(search_messages_by_keyword, param)
        