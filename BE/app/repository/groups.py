from app.util.database.abstract_query_repo import AbstractQueryRepo
from app.util.database.db_factory import DBFactory
from app.domain.groups import Groups

#   id INTEGER [pk, increment]
#   name VARCHAR(32)
#   description VARCHAR(255)        -> 이거 뭐임?
#   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
#   updated_at TIMESTAMP 
#   deleted_at TIMESTAMP

make_group = """
INSERT INTO groups (
    name,
    description,
    updated_at,
    deleted_at,
)
VALUES (
    %(group_name)s,
    %(group_description)s,
    NULL,
    NULL,
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

find_group_by_name = """
SELECT * FROM groups WHERE name = %(group_name)s;
"""

find_all_groups_by_id = """
SELECT * FROM groups;
"""

class QueryRepo(AbstractQueryRepo):
    def __init__(self):
        db = DBFactory.get_db("MySQL")
        super().__init__(db)

    def make_group(self, group_name_and_group_desc: dict):
        return self.db.execute(make_group, group_name_and_group_desc)
    
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