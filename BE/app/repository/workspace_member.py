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
    nickname = %(nickname)s,
    email = %(email)s,
    github = %(github)s,
    blog = %(blog)s,
    image = %(image)s,
    phone = %(phone)s
WHERE id = %(id)s
AND deleted_at IS NULL;
"""

find_member_by_id = """
SELECT * 
FROM workspace_members 
WHERE id = %(id)s
AND deleted_at IS NULL;
"""

find_member_by_email = """
SELECT * 
FROM workspace_members 
WHERE email = %(email)s;
"""

find_all_workspace_members = """
SELECT * FROM workspace_members
WHERE workspace_id = %(workspace_id)s
AND deleted_at IS NULL;
"""

class QueryRepo(AbstractQueryRepo):
    def __init__(self):
        db = DBFactory.get_db("MySQL")
        super().__init__(db)

    def find_by_id(self, id: UUID) -> WorkspaceMember:
        param = {
            "id": UUID(id).bytes
        }
        return self.db.execute(find_member_by_id, param)

    def find_by_email(self, email: str) -> WorkspaceMember:
        param = {
            "email": email
        }
        return self.db.execute(find_member_by_email, param)
    
    def find_all(self, workspace_id: int) -> List[WorkspaceMember]:
        param = {
            "workspace_id": workspace_id
        }
        return self.db.execute(find_all_workspace_members, param)
    
    def update(self, id: UUID) -> WorkspaceMember:
        update_data["id"] = bytes.fromhex(id)  # 문자열 hex → binary UUID   
        return self.db.execute(update_workspace_member, update_data)
