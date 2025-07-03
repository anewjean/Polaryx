from datetime import datetime
from typing import List
from uuid import UUID

from BE.app.util.database.abstract_query_repo import AbstractQueryRepo
from BE.app.util.database.db_factory import DBFactory
from BE.app.domain.tabs import Tabs

#   id BIGINT [pk, increment]

#   workspace_id INTEGER [ref: > workspaces.id]
#   section_id INTEGER [ref: > section_types.id]
#   name VARCHAR(64)

#   is_pinned BOOLEAN [default: false]
#   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
#   updated_at TIMESTAMP default null
#   deleted_at TIMESTAMP default null


# 이거 만든거 다시 찾아오려면
# 1. id를 알고 있거나,
# 2. 고유한 다른 값이 있어야 되는데,
# 둘다 없는 상황임. -> 해결 필요.
insert_tab_and_get = """
INSERT INTO tabs (
    workspace_id,
    section_id,
    name
)
VALUES (
    %(workspace_id)s, 
    %(section_id)s, 
    %(name)s
);
SELECT * FROM tabs WHERE workspace_id = %(workspace_id)s
                     AND section_id = %(workspace_id)s
                     AND name = %(name)s;
"""

update_workspace_member = """
UPDATE workspace_members
SET 
WHERE;
"""

find_tabs_by_id = """
SELECT * FROM tabs WHERE id = %(id)s;
"""

find_tabs_by_all_properties = """
SELECT * FROM tabs WHERE name = %(name)s
                     AND workspace_id = %(workspace_id)s
                     AND section_id = %(section_id)s;
"""

find_tabs_by_workspace_id = """
SELECT * FROM tabs WHERE workspace_id = %(workspace_id)s;
"""

find_tabs_by_section_id = """
SELECT * FROM tabs WHERE section_id = %(section_id)s;
"""

find_all_tabs = """
SELECT * FROM workspace_members
        WHERE workspace_id = %(workspace_id)s
          AND deleted_at IS NULL;
"""

class QueryRepo(AbstractQueryRepo):
    def __init__(self):
        db = DBFactory.get_db("MySQL")
        super().__init__(db)

    def insert_tab_and_get(self, workspace_id_and_section_id_and_name: dict):
        return self.db.execute(insert_tab_and_get, workspace_id_and_section_id_and_name)

    def find_tabs_by_id(self, id: int) -> Tabs:
        param = {
            "id": id
        }
        return self.db.execute(find_tabs_by_id, param)
    
    def find_tabs_by_all_properties(self, workspace_id_and_section_id_and_name: str) -> Tabs:
        return self.db.execute(find_tabs_by_all_properties, workspace_id_and_section_id_and_name)

    def find_tabs_by_workspace_id(self, id: UUID):
        param = {
            "id": UUID(id).bytes
        }
        return self.db.execute(find_tabs_by_workspace_id, param)

    def find_tabs_by_section_id(self, email: str):
        param = {
            "email": email
        }
        return self.db.execute(find_tabs_by_section_id, param)