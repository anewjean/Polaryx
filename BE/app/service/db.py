from app.repository.db import DBRepository

class DBService:
    def __init__(self):
        self.repo = DBRepository()
    
    def reset(self):
        self.repo.reset()