from typing import List
from uuid import UUID

from BE.app.util.database.abstract_query_repo import AbstractQueryRepo
from BE.app.util.database.db_factory import DBFactory
from BE.app.domain.message import Message, MessageUpdateType

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
    