from datetime import datetime
from typing import List
from uuid import UUID

from app.util.database.abstract_query_repo import AbstractQueryRepo
from app.util.database.db_factory import DBFactory
from app.domain.tabs import SubTabs

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

find_sub_tabs_by_tab_id = """
SELECT * FROM sub_tabs WHERE tab_id = %(tab_id)s;
"""

find_sub_tabs_by_workspace_id = """
SELECT * FROM sub_tabs WHERE workspace_id = %(workspace_id)s;
"""

find_sub_tabs_by_section_id = """
SELECT * FROM sub_tabs WHERE section_id = %(section_id)s;
"""

find_all_sub_tabs = """
SELECT * FROM workspace_members
WHERE workspace_id = %(workspace_id)s
AND deleted_at IS NULL;
"""

class QueryRepo(AbstractQueryRepo):
    def __init__(self):
        db = DBFactory.get_db("MySQL")
        super().__init__(db)

    def find_sub_tabs_by_tab_id(self, id: int) -> SubTabs:
        param = {
            "id": id
        }
        return self.db.execute(find_sub_tabs_by_tab_id, param)

    def find_sub_tabs_by_workspace_id(self, id: UUID) -> SubTabs:
        param = {
            "id": UUID(id).bytes
        }
        return self.db.execute(find_sub_tabs_by_workspace_id, param)

    def find_sub_tabs_by_section_id(self, email: str) -> SubTabs:
        param = {
            "email": email
        }
        return self.db.execute(find_sub_tabs_by_section_id, param)