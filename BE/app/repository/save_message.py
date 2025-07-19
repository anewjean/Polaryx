from uuid import UUID
from typing import List
from datetime import datetime

from app.domain.save_message import SaveMessage
from app.util.database.abstract_query_repo import AbstractQueryRepo
from app.util.database.db_factory import DBFactory

insert_message = """
INSERT INTO save_messages (
    sender_id,
    workspace_id,
    content
)
VALUES (
    %(sender_id)s,
    %(workspace_id)s,
    %(content)s
);
"""

find_all_by_user = """
SELECT 
    id, sender_id, workspace_id, content, 
    created_at, updated_at, deleted_at
FROM save_messages
WHERE sender_id = %(sender_id)s 
AND workspace_id = %(workspace_id)s
AND deleted_at IS NULL
ORDER BY created_at DESC;
"""

delete_message = """
UPDATE save_messages
SET 
    deleted_at = %(deleted_at)s
WHERE id = %(message_id)s
  AND sender_id = %(current_user_id)s
  AND deleted_at IS NULL;
"""

class SaveMessageRepo(AbstractQueryRepo):
    def __init__(self):
        db = DBFactory.get_db("MySQL")
        super().__init__(db)

    async def insert(self, save_message: SaveMessage):
        sender_id = save_message.sender_id
        sender_id_bytes = (
            sender_id.bytes if isinstance(sender_id, UUID)
            else UUID(str(sender_id)).bytes
        )

        params = {
            "workspace_id": save_message.workspace_id,
            "sender_id": sender_id_bytes,
            "content": save_message.content
        }
        self.db.execute(insert_message, params)

    async def find_all_by_user(self, sender_id: UUID, workspace_id: int) -> List[SaveMessage]:
        params = {
            "sender_id": sender_id.bytes,
            "workspace_id": workspace_id
        }
        rows = await self.db.fetch_all(find_all_by_user, params)
        return [SaveMessage.from_row(row) for row in rows]

    async def delete_by_id(self, message_id: int, sender_id: UUID):
        params = {
            "message_id": message_id,
            "current_user_id": sender_id.bytes,
            "deleted_at": datetime.now()
        }
        await self.db.execute(delete_message, params)
