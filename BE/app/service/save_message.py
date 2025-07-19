from app.repository.save_message_repo import SaveMessageRepo

class SaveMessageService:
    def __init__(self):
        self.repo = SaveMessageRepo()

    async def save(self, sender_id, workspace_id, content):
        ...

    async def get_all(self, sender_id, workspace_id):
        ...

    async def delete(self, message_id, sender_id):
        ...
