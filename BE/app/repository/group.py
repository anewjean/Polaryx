from app.util.database.abstract_query_repo import AbstractQueryRepo
from app.util.database.db_factory import DBFactory
from app.domain.groups import Groups

from uuid import UUID
from zoneinfo import ZoneInfo
from datetime import datetime

#   id INTEGER [pk, increment]
#   name VARCHAR(32)
#   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
#   updated_at TIMESTAMP 
#   deleted_at TIMESTAMP

make_group = """
INSERT INTO groups (
    name,
    workspace_id
)
VALUES (
    %(group_name)s,
    %(workspace_id)s
);
"""

update_workspace_member = """
UPDATE groups
SET 
WHERE;
"""

find_group_by_id = """
SELECT * FROM groups WHERE id = %(group_id)s;
"""

get_all_groups_with_id = """
SELECT id, name FROM groups 
WHERE deleted_at IS NULL;
"""

find_group_by_name = """
SELECT * FROM groups WHERE name = %(group_name)s;
"""

insert_group_member_query = """
INSERT INTO group_members (
    group_id,
    user_id,
    user_name
)
SELECT
    %(group_id)s AS group_id,
    u.id         AS user_id,
    u.name       AS user_name
FROM users u
WHERE u.email = %(email)s
  AND NOT EXISTS (
    SELECT 1
    FROM group_members gm
    WHERE gm.group_id = %(group_id)s
      AND gm.user_id = u.id
);
"""

find_all_groups_by_id = """
SELECT * FROM groups;
"""

find_del_target_by_id = """
SELECT gm.id FROM group_members gm
JOIN groups g ON gm.group_id = g.id
WHERE g.workspace_id = %(workspace_id)s
  AND gm.user_id = %(user_id)s
  AND gm.deleted_at IS NULL;
"""

delete_wm_by_id = """
UPDATE group_members gm
JOIN groups g ON gm.group_id = g.id
SET 
    gm.deleted_at = %(deleted_at)s
WHERE g.workspace_id = %(workspace_id)s
  AND gm.user_id = %(user_id)s
  AND gm.deleted_at IS NULL;
"""

class QueryRepo(AbstractQueryRepo):
    def __init__(self):
        db = DBFactory.get_db("MySQL")
        super().__init__(db)

    # 수정중
    def get_all_groups_with_id(self):
        return self.db.execute(get_all_groups_with_id)

    def make_group(self, group_name: str, workspace_id: int):
        params = {
            "group_name": group_name,
            "workspace_id": workspace_id
        }
        result = self.db.execute(make_group, params)
        return result['lastrowid']

    def insert_group_member(self, data: dict):
        params = {
            "email": data["email"],
            "group_id": data["group_id"]
        }
        return self.db.execute(insert_group_member_query, params)
    
    # 윤석 작성
    def find_group_by_id(self, group_id: int) -> Groups:
        param = {
            "group_id": group_id
        }
        return self.db.execute(find_group_by_id, param)

    def find_group_by_name(self, group_name: str) -> Groups:
        param = {
            "group_name": group_name
        }
        return self.db.execute(find_group_by_name, param)
    
    def find_all_groups_by_id(self, group_id: int):
        param = {
            "group_id": group_id
        }
        return self.db.execute(find_all_groups_by_id, param)
    
    def insert_member_by_group_name(self, data: dict):
        params = {
            "user_id": data["user_id"],
            "group_name": data["group"],
            "user_name": data["nickname"]
        }
        return self.db.execute(insert_group_member, params)
    
    def delete_member(self, user_id:  UUID.bytes, workspace_id: int) -> bool:
        params = {
            "user_id": user_id,
            "workspace_id": workspace_id,
            "deleted_at": datetime.now(ZoneInfo("Asia/Seoul")).isoformat()
        }
        find_res = self.db.execute(find_del_target_by_id, params)
        target_num = len(find_res)
        del_res = self.db.execute(delete_wm_by_id, params)
        res_num = del_res["rowcount"]
        return target_num == res_num
