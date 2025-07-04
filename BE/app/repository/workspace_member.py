from datetime import datetime
from typing import List
from uuid import UUID

from BE.app.util.database.abstract_query_repo import AbstractQueryRepo
from BE.app.util.database.db_factory import DBFactory
from BE.app.domain.workspace_member import WorkspaceMember

insert_workspace_member = """
INSERT INTO workspace_members (

)
VALUES (

);
"""

update_workspace_member = """
UPDATE workspace_members
SET 
WHERE;
"""

find_member_by_id = """
SELECT * FROM workspace_members WHERE user_id = %(id)s;
"""

find_member_by_email = """
SELECT * FROM workspace_members WHERE email = %(email)s;
"""

find_all_workspace_members = """
SELECT * FROM workspace_members
WHERE workspace_id = %(workspace_id)s
AND deleted_at IS NULL;
"""

find_member_by_nickname = """
SELECT * FROM workspace_members WHERE nickname = %(nickname)s;
"""

class QueryRepo(AbstractQueryRepo):
    def __init__(self):
        db = DBFactory.get_db("MySQL")
        super().__init__(db)

    def find_by_id(self, id: str) -> WorkspaceMember:
        param = {
            "id": id
        }
        return self.db.execute(find_member_by_id, param)

    def find_by_email(self, email: str) -> WorkspaceMember:
        param = {
            "email": email
        }
        return self.db.execute(find_member_by_email, param)
    
    def find_by_nickname(self, nickname: str) -> WorkspaceMember:
        param = {
            "nickname": nickname
        }
        return self.db.execute(find_member_by_nickname, param)