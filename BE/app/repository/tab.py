from app.util.database.abstract_query_repo import AbstractQueryRepo
from app.util.database.db_factory import DBFactory
from uuid import UUID
from typing import List, Optional

is_dup_name_in_tab_by_section = """
SELECT * FROM tabs
WHERE 
      workspace_id = %(workspace_id)s
  AND section_id = %(section_id)s
  AND name = %(name)s;
"""

create_tab = """
INSERT INTO tabs (
    name, 
    workspace_id, 
    section_id, 
    sub_section_id
)
VALUES (
    %(tab_name)s, 
    %(workspace_id)s, 
    %(section_id)s, 
    {subsection_id}
)
"""

find_tab_by_uq = """
SELECT id, name, section_id, sub_section_id
FROM tabs
WHERE workspace_id = %(workspace_id)s
  AND name = %(tab_name)s
  AND section_id = %(section_id)s
  AND sub_section_id <=> %(subsection_id)s
"""

find_tab = """
SELECT 
  t.id,
  t.name,
  t.section_id,
  s.name,
  t.sub_section_id,
  s.sub_name
FROM tab_members tm
LEFT JOIN tabs t ON t.id = tm.tab_id
LEFT JOIN sections s 
  ON s.id = t.section_id 
 AND s.sub_id <=> t.sub_section_id
 AND s.workspace_id = t.workspace_id
WHERE t.workspace_id = %(workspace_id)s
  AND t.id = %(tab_id)s
  AND t.deleted_at IS NULL
GROUP BY tm.user_id;
"""

find_tabs = """
SELECT 
  t.id,
  t.name,
  t.section_id,
  s.name,
  t.sub_section_id,
  s.sub_name
FROM tabs t
LEFT JOIN tab_members tm ON t.id = tm.tab_id
LEFT JOIN sections s 
  ON s.id = t.section_id 
 AND s.sub_id <=> t.sub_section_id
 AND s.workspace_id = t.workspace_id
WHERE tm.workspace_id = %(workspace_id)s
  AND tm.user_id = %(user_id)s
  AND t.deleted_at IS NULL;
"""

is_section_in_workspace = """
SELECT * FROM sections
WHERE 
      id = %(section_id)s 
  AND workspace_id = %(workspace_id)s;
"""

# find_members = """
# SELECT 
#     wm.user_id,
#     wm.nickname,
#     wm.image, 
#     r.name as role,
#     GROUP_CONCAT(DISTINCT g.name) as groups
# FROM workspace_members wm
# LEFT JOIN tab_members tm ON wm.user_id = tm.user_id
# LEFT JOIN member_roles mr ON wm.user_id = mr.user_id
# LEFT JOIN roles r ON mr.role_id = r.id
# LEFT JOIN group_members gm ON wm.user_id = gm.user_id
# LEFT JOIN groups g ON gm.group_id = g.id
# WHERE wm.workspace_id = %(workspace_id)s
#   AND tm.tab_id = %(tab_id)s
#   AND wm.deleted_at IS NULL
# GROUP BY wm.user_id, wm.nickname, wm.image, r.name;
# """

find_members = """
SELECT 
    wm.user_id,
    wm.nickname,
    wm.image, 
    MAX(r.name) AS role,
    GROUP_CONCAT(DISTINCT g.name) AS groups
FROM workspace_members wm
LEFT JOIN tab_members tm ON wm.user_id = tm.user_id
LEFT JOIN member_roles mr ON wm.user_id = mr.user_id
LEFT JOIN roles r ON mr.role_id = r.id
LEFT JOIN group_members gm ON wm.user_id = gm.user_id
LEFT JOIN groups g ON gm.group_id = g.id
WHERE wm.workspace_id = %(workspace_id)s
  AND tm.tab_id = %(tab_id)s
  AND wm.deleted_at IS NULL
GROUP BY wm.user_id, wm.nickname, wm.image;
"""

find_non_members = """
SELECT 
    wm.user_id,
    wm.nickname,
    wm.image, 
    r.name as role,
    GROUP_CONCAT(DISTINCT g.name) as groups
FROM workspace_members wm
LEFT JOIN member_roles mr ON wm.user_id = mr.user_id
LEFT JOIN roles r ON mr.role_id = r.id
LEFT JOIN group_members gm ON wm.user_id = gm.user_id
LEFT JOIN groups g ON gm.group_id = g.id
WHERE wm.workspace_id = %(workspace_id)s
  AND wm.user_id NOT IN (
      SELECT user_id
      FROM tab_members
      WHERE tab_id = %(tab_id)s
  )
  AND wm.deleted_at IS NULL
GROUP BY wm.user_id, wm.nickname, wm.image, r.name;
"""

insert_tab_members = """
INSERT INTO tab_members 
    (workspace_id, user_id, tab_id)
VALUES (%(workspace_id)s, %(user_id)s, %(tab_id)s);
"""

find_nicknames = """
SELECT wm.nickname 
FROM tab_members tm 
JOIN workspace_members wm 
  ON wm.user_id = tm.user_id 
WHERE tm.tab_id = %(tab_id)s;
"""

find_tabs_by_id = """
SELECT * FROM tabs WHERE id = %(id)s;
"""

find_tab_member_by_user_id = """
SELECT * FROM tab_members WHERE user_id = %(user_id)s;
"""

class TabRepository(AbstractQueryRepo):
    def __init__(self):
        db = DBFactory.get_db("MySQL")
        super().__init__(db)

    def is_duplicate(self, workspace_id: int, section_id:int, name: str):
        param = {
            "workspace_id": workspace_id,
            "section_id": section_id,
            "name": name
        }
        result = self.execute(is_dup_name_in_tab_by_section, param)
        return bool(result)

    def insert(self, workspace_id, tab_name, section_id, subsection_id):
        query = create_tab.format(
            subsection_id=subsection_id if subsection_id is not None else "NULL"
        )
        param = {
            "workspace_id": workspace_id,
            "tab_name": tab_name,
            "section_id": section_id
        }
        self.execute(query, param)

    def find(self, workspace_id: int, tab_id: int):
        param = {
            "workspace_id": workspace_id,
            "tab_id": tab_id
        }
        return self.execute(find_tab, param)

    def find_by_uq(self, workspace_id: int, tab_name: str, section_id: int, subsection_id: Optional[int]):
        param = {
            "workspace_id": workspace_id,
            "tab_name": tab_name,
            "section_id": section_id,
            "subsection_id": subsection_id
        }
        return self.execute(find_tab_by_uq, param)
    
    def find_tabs_by_id(self, tab_id: int):
        param = {
            # "workspace_id": workspace_id,
            "id": tab_id
        }
        return self.execute(find_tabs_by_id, param)
    
    def find_all(self, workspace_id: int, user_id: str):
        param = {
            "workspace_id": workspace_id,
            "user_id": UUID(user_id).bytes
        }
        return self.execute(find_tabs, param)
    
    def validate_section_in_workspace(self, section_id: int, workspace_id: int):
        param = {
            "workspace_id": workspace_id,
            "section_id": section_id
        }
        result = self.execute(is_section_in_workspace, param)
        return bool(result)

    def find_members(self, workspace_id: int, tab_id: int):
        param = {
            "workspace_id": workspace_id,
            "tab_id": tab_id
        }
        return self.execute(find_members, param)

    def find_non_members(self, workspace_id: int, tab_id: int):
        param = {
            "workspace_id": workspace_id,
            "tab_id": tab_id
        }
        return self.execute(find_non_members, param)

    def insert_members(self, workspace_id: int, tab_id: int, user_ids: List[str]):
        for user_id in user_ids:
            param = {
                "workspace_id": workspace_id,
                "tab_id": tab_id,
                "user_id": UUID(user_id).bytes
            }
            
            self.execute(insert_tab_members, param)

        return self.execute(find_nicknames, {"tab_id": tab_id})
    
    def find_by_user_id(self, user_id: UUID.bytes):
        param = {
            "user_id": user_id
        }
        return self.db.execute(find_tab_member_by_user_id, param)