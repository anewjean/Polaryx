from typing import List
from uuid import UUID

from app.util.database.abstract_query_repo import AbstractQueryRepo
from app.util.database.db_factory import DBFactory

insert_notification = """
INSERT INTO notifications (
    receiver_id, sender_id, tab_id, message_id, type, content
) VALUES (
    %(receiver_id)s, %(sender_id)s, %(tab_id)s, %(message_id)s, %(type)s, %(content)s
);
"""

find_by_user = """
SELECT id, receiver_id, sender_id, tab_id, message_id, type, content, is_read, created_at, read_at
FROM notifications
WHERE receiver_id = %(receiver_id)s
ORDER BY created_at DESC;
"""

class QueryRepo(AbstractQueryRepo):
    def __init__(self):
        db = DBFactory.get_db("MySQL")
        super().__init__(db)

    def insert(self, data: dict):
        return self.db.execute(insert_notification, data)

    def find_by_user(self, user_id: UUID):
        return self.db.execute(find_by_user, {"receiver_id": user_id.bytes})