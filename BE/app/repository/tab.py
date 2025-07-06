from BE.app.util.database.abstract_query_repo import AbstractQueryRepo
from BE.app.util.database.db_factory import DBFactory


CREATE_TAB_QUERY = """
INSERT INTO tabs (name, workspace_id, section_id, sub_section_id)
VALUES (%(name)s, %(workspace_id)s, %(section_id)s, %(sub_section_id)s)
"""

GET_TABS_BY_WORKSPACE_ID_QUERY = """
SELECT id, name, workspace_id, section_id, sub_section_id, created_at, updated_at, deleted_at
FROM tabs
WHERE workspace_id = %(workspace_id)s
AND deleted_at IS NULL
"""

class TabRepository(AbstractQueryRepo):
    def __init__(self):
        db = DBFactory.get_db("MySQL")
        super().__init__(db)

    def create_tab(self, data: dict):
        self.execute(CREATE_TAB_QUERY, data)

    def get_tabs_by_workspace_id(self, workspace_id: int):
        return self.execute(GET_TABS_BY_WORKSPACE_ID_QUERY, {"workspace_id": workspace_id})
    
    #section_id와 workspace_id가 일치하는지 검증하는 메소드 
    def validate_section_in_workspace(self, section_id: int, workspace_id: int) -> bool:
        query = """
        SELECT * FROM sections
        WHERE id = %(section_id)s AND workspace_id = %(workspace_id)s
        """
        result = self.execute(query, {"section_id": section_id, "workspace_id": workspace_id})
        print(result)
        return bool(result)
    
