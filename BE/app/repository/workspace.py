from app.util.database.abstract_query_repo import AbstractQueryRepo
from app.util.database.db_factory import DBFactory
from app.domain.workspace import Workspace

find_workspace = """
SELECT * FROM workspaces WHERE id = %(id)s;
"""

class QueryRepo(AbstractQueryRepo):
    def __init__(self):
        db = DBFactory.get_db("MySQL")
        super().__init__(db)
    
    def find_by_id(self, id: int) -> Workspace:
        param = {
            "id": id
        }
        return self.db.execute(find_workspace, param)