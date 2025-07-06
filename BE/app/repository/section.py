from typing import List, Optional
from app.util.database.abstract_query_repo import AbstractQueryRepo
from app.util.database.db_factory import DBFactory
from app.domain.section import Section

insert_section = """
INSERT INTO sections (
    workspace_id,
    section_type_id,
    name
)
VALUES (
    %(workspace_id)s,
    %(section_type_id)s,
    %(name)s
);
"""

update_section = """
UPDATE sections
SET
    name = %(name)s,
    sub_id = %(sub_id)s,
    sub_name = %(sub_name)s,
    updated_at = CURRENT_TIMESTAMP
WHERE id = %(id)s;
"""

delete_section = """
DELETE FROM sections
WHERE id = %(id)s;
"""

find_section_by_id = """
SELECT * FROM sections
WHERE id = %(id)s;
"""

find_sections_by_workspace = """
SELECT * FROM sections
WHERE workspace_id = %(workspace_id)s;
"""


class SectionQueryRepo(AbstractQueryRepo):
    def __init__(self):
        db = DBFactory.get_db("MySQL")
        super().__init__(db)

    def insert(self, section: Section):
        params = {
            "workspace_id": section.workspace_id,
            "name": section.name,
            "sub_id": section.sub_id,
            "sub_name": section.sub_name
        }
        return self.db.execute(insert_section, params)

    def update(self, section: Section):
        params = {
            "id": section.id,
            "name": section.name,
            "sub_id": section.sub_id,
            "sub_name": section.sub_name
        }
        return self.db.execute(update_section, params)

    def delete(self, section_id: int):
        return self.db.execute(delete_section, {"id": section_id})

    def find_by_id(self, section_id: int) -> Optional[Section]:
        return self.db.execute(find_section_by_id, {"id": section_id})
    
    def find_all_by_workspace(self, workspace_id: int) -> List[Section]:
        rows = self.db.execute(find_sections_by_workspace, {"workspace_id": workspace_id})
        return [Section.from_row(row) for row in rows]

    
    