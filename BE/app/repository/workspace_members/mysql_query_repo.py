from BE.app.util.database.abstract_query_repo import AbstractQueryRepo
from BE.app.util.database.db_factory import DBFactory

find_all_workspace_members = """
SELECT * FROM workspace_members;
"""

find_workspace_members_by_id = """
SELECT id, user_id, nickname, email, github, blog, image
FROM workspace_members
WHERE id = %s AND deleted_at IS NULL;"""

class QueryRepo(AbstractQueryRepo):
    def __init__(self):
        super().__init__()
        self.db = DBFactory.get_db("mysql")
        self.queries["find_all_workspace_members"] = find_all_workspace_members
        self.queries["find_workspace_member_by_id"] = find_workspace_members_by_id
    
    def find_workspace_members(self, id: bytes):
        query = find_workspace_members_by_id
        result = self.db.execute(query, {"id": id})
        if not result:
            raise ValueError("해당 맴버를 찾을 수 없습니다.")
        return result