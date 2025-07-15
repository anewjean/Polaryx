from datetime import datetime
from typing import List
from uuid import UUID

from app.util.database.abstract_query_repo import AbstractQueryRepo
from app.util.database.db_factory import DBFactory
from app.domain.workspace_member import WorkspaceMember

insert_workspace_member = """
INSERT INTO workspace_members (
    id, user_id, workspace_id, nickname, email, github, blog
)
SELECT 
    %(id)s AS id,
    u.id AS user_id,
    %(workspace_id)s AS workspace_id,
    %(nickname)s AS nickname,
    %(email)s AS email,
    %(github)s AS github,
    %(blog)s AS blog
FROM users u
WHERE u.email = %(email)s
  AND NOT EXISTS (
    SELECT 1 
    FROM workspace_members wm 
    WHERE wm.user_id = u.id 
      AND wm.workspace_id = %(workspace_id)s
      AND wm.deleted_at IS NULL
  );
"""

update_workspace_member = """
UPDATE workspace_members
SET
    nickname = COALESCE(%(nickname)s, nickname),
    github  = COALESCE(%(github)s, github),
    blog    = COALESCE(%(blog)s, blog),
    image   = COALESCE(%(image)s, image),
    phone   = COALESCE(%(phone)s, phone)
WHERE id = %(user_id)s
  AND deleted_at IS NULL;
"""

find_member_by_id = """
SELECT * 
FROM workspace_members 
WHERE id = %(user_id)s
AND deleted_at IS NULL;
"""

find_member_by_email = """
SELECT *
FROM workspace_members
WHERE email = %(email)s;
"""

find_member_by_user_id = """
SELECT 
    wm.user_id,
    wm.workspace_id,
    wm.nickname,
    wm.email,
    wm.image,
    r.name AS role,
    GROUP_CONCAT(DISTINCT g.name),
    wm.github,
    wm.blog
FROM workspace_members wm
LEFT JOIN member_roles mr ON wm.user_id = mr.user_id
LEFT JOIN roles r ON mr.role_id = r.id
LEFT JOIN group_members gm ON wm.user_id = gm.user_id
LEFT JOIN `groups` g ON gm.group_id = g.id
WHERE wm.user_id = %(user_id)s
  AND wm.deleted_at IS NULL
GROUP BY wm.user_id, wm.workspace_id, wm.nickname, wm.email, wm.image, r.name, wm.github, wm.blog;
"""

update_workspace_member_by_user_id = """
UPDATE workspace_members
SET
    nickname = COALESCE(%(nickname)s, nickname),
    github  = COALESCE(%(github)s, github),
    blog    = COALESCE(%(blog)s, blog),
    image   = COALESCE(%(image)s, image)
WHERE user_id = %(user_id)s
  AND deleted_at IS NULL;
"""

find_all_workspace_members = """
SELECT * FROM workspace_members
WHERE workspace_id = %(workspace_id)s
AND deleted_at IS NULL;
"""

find_member_by_nickname = """
SELECT * FROM workspace_members WHERE nickname = %(nickname)s;
"""

find_member_by_workspace_columns = """
SELECT COLUMN_NAME
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'workspace_members';
"""

find_nickname_email_image_by_workspace_id = """
SELECT wm.nickname, wm.email, wm.image, r.name FROM workspace_members wm
JOIN member_roles mr ON mr.user_id = wm.user_id
JOIN roles r ON r.id = mr.role_id
WHERE wm.workspace_id = %(workspace_id)s
AND wm.deleted_at IS NULL;
"""

class QueryRepo(AbstractQueryRepo):
    def __init__(self):
        db = DBFactory.get_db("MySQL")
        super().__init__(db)

    def bulk_insert_workspace_member(self, data: dict):
        return self.db.execute_many(insert_workspace_member, data)

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

    def update(self, id: UUID, update_data: dict) -> WorkspaceMember:
        params = update_data.dict()
        params["user_id"] = id if isinstance(id, bytes) else UUID(id).bytes
  
        return self.db.execute(update_workspace_member_by_user_id, params)

    def find_by_user_id(self, user_id: UUID.bytes) -> WorkspaceMember:
        param = {
            "user_id": user_id
        }
        return self.db.execute(find_member_by_user_id, param)
    
    def find_by_user_workspace_id(self, workspace_id: int) -> WorkspaceMember:
        param = {
            "workspace_id": workspace_id
        }
        # [0]: nickname
        # [1]: email
        # [2]: image
        # [3]: role_name
        return self.db.execute(find_nickname_email_image_by_workspace_id, param)

    def find_by_workspace_columns(self):
        return self.db.execute(find_member_by_workspace_columns)
    