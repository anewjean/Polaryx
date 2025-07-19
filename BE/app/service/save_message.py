from uuid import UUID

from app.domain.save_message import SaveMessage
from app.repository.save_message import SaveMessageRepo


class SaveMessageService:
    def __init__(self):
        self.repo = SaveMessageRepo()

    async def save(self, sender_id: UUID, workspace_id: int, content: str) -> None:
        message = SaveMessage.of(sender_id, workspace_id, content)
        await self.repo.insert(message)

    async def get_all(self, sender_id: UUID, workspace_id: int):
        return await self.repo.find_all_by_user(sender_id, workspace_id)

    async def delete(self, message_id: int, sender_id: UUID) -> None:
        await self.repo.delete_by_id(message_id, sender_id)