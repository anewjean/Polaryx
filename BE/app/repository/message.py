from typing import List
from uuid import UUID

from app.util.database.abstract_query_repo import AbstractQueryRepo
from app.util.database.db_factory import DBFactory
from app.domain.message import Message, MessageUpdateType

insert_message = """
INSERT INTO messages (
    tab_id,
    sender_id,
    content
)
VALUES (
    %(tab_id)s,
    %(sender_id)s,
    %(content)s
);
"""

update_message = """
UPDATE messages
SET 
    content = %(content)s,
    is_updated = TRUE
WHERE id = %(id)s;
"""

delete_message = """
UPDATE messages
SET 
    deleted_at = %(deleted_at)s
WHERE id = %(id)s;
"""

find_message = """
SELECT * FROM messages WHERE id = %(id)s;
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
    m.deleted_at
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
    m.deleted_at
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
    m.deleted_at
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


class QueryRepo(AbstractQueryRepo):
    def __init__(self):
        db = DBFactory.get_db("MySQL")
        super().__init__(db)
    
    def find_by_id(self, id: int) -> Message:
        param = {
            "id": id
        }
        return self.db.excute(find_message, param)

    def find_all(self, tab_id: int) -> List[Message]:
        param = {
            "tab_id": tab_id
        }
        return self.db.execute(find_all_messages, param)

    def find_recent_30(self, tab_id: int, before_id: int | None) -> List[Message]:
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
        params = {
            "tab_id": message.tab_id,
            "sender_id": UUID(message.sender_id).bytes,
            "content": message.content
        }
        return self.db.execute(insert_message, params)
    
    def update(self, message: Message):
        if message.update_type == MessageUpdateType.MODIFY:
            params = {
                "id": message.id, 
                "content": message.content
            }
            return self.db.execute(update_message, params)

        elif message.update_type == MessageUpdateType.DELETE:
            params = {
                "id": message.id,
                "deleted_at": message.deleted_at
            }
            return self.db.execute(delete_message, params)
    

    def delete_all(self):
        print("delete_all_message")
        return self.db.execute(delete_all_message)