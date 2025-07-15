import uuid
from typing import List

from app.domain.notification import Notification

from app.repository.notification import QueryRepo as NotificationRepo

class NotificationService:
    def __init__(self):
        self.repo = NotificationRepo()

    async def create_notification(self, receiver_id: str, sender_id: str, tab_id: int, message_id: int, type: int, content: str):
        data = {
            "receiver_id": uuid.UUID(receiver_id).bytes,
            "sender_id": uuid.UUID(sender_id).bytes,
            "tab_id": tab_id,
            "message_id": message_id,
            "type": type,
            "content": content,
        }
        self.repo.insert(data)

    def get_notifications(self, receiver_id: str) -> List[Notification]:
        rows = self.repo.find_by_user(uuid.UUID(receiver_id))
        return [Notification.from_row(row) for row in rows]