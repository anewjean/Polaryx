from datetime import datetime
from typing import List
from uuid import UUID

from BE.app.util.database.abstract_query_repo import AbstractQueryRepo
from BE.app.util.database.db_factory import DBFactory
from BE.app.domain.tab_members import TabMembers

# tab_members -> created_at col 넣으면 좋을듯.
# 초대된 시점 이후 메시지 부터 보여줄지,
# 처음 방 있을때부터 메세지 전부 보여줄지 선택할 수 있게끔.

insert_tab_members = """
INSERT INTO tab_members (
    tab_id,
    user_id
)
VALUES (
    %(tab_id)s,
    %(user_id)s
);
"""

update_tab_members = """
UPDATE workspace_members
SET 
WHERE;
"""

find_tab_member_by_user_id = """
SELECT * FROM tab_members WHERE user_id = %(user_id)s;
"""

find_tab_member_by_tab_id = """
SELECT * FROM tab_members WHERE tab_id = %(tab_id)s;
"""

find_tab_member_by_user_id_and_tab_id = """
SELECT * FROM tab_members WHERE user_id = %(user_id)s
                            AND tab_id = %(tab_id)s;
"""

find_all_tab_members = """
SELECT * FROM tab_members;
"""

class QueryRepo(AbstractQueryRepo):
    def __init__(self):
        db = DBFactory.get_db("MySQL")
        super().__init__(db)

    def insert_tab_members(self, tab_id_and_user_id: dict):
        return self.db.execute(insert_tab_members, tab_id_and_user_id)

    def find_by_user_id(self, user_id: UUID):
        param = {
            "user_id": UUID(user_id).bytes
        }
        return self.db.execute(find_tab_member_by_user_id, param)

    def find_tab_member_by_tab_id(self, tab_id: str):
        param = {
            "tab_id": tab_id
        }
        return self.db.execute(find_tab_member_by_tab_id, param)
    
    def find_tab_member_by_user_id_and_tab_id(self, tab_id_and_user_id: dict) -> TabMembers:
        return self.db.execute(find_tab_member_by_user_id_and_tab_id, tab_id_and_user_id)
    