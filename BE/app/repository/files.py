from datetime import datetime
from typing import List
from uuid import UUID

from app.util.database.abstract_query_repo import AbstractQueryRepo
from app.util.database.db_factory import DBFactory
from app.domain.workspace_member import WorkspaceMember


    # id BIGINT AUTO_INCREMENT PRIMARY KEY,
    # message_id BIGINT NOT NULL,
    # url VARCHAR(255) NOT NULL,
    # created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    # updated_at TIMESTAMP NULL DEFAULT NULL,
    # deleted_at TIMESTAMP NULL DEFAULT NULL

insert_file = """
INSERT INTO files (
    message_id, url
)
VALUES (
    %(message_id)s, %(file_url)s
);
"""

update_workspace_member = """
UPDATE workspace_members
SET 
WHERE;
"""

find_file_by_message_id = """
SELECT * FROM files 
WHERE user_id = %(id)s;
"""

find_member_by_email = """
SELECT * FROM workspace_members WHERE email = %(email)s;
"""

find_members_by_group_id = """
SELECT * FROM workspace_members WHERE group_id = %(group_id)s;
"""

find_all_workspace_members = """
SELECT * FROM workspace_members
WHERE workspace_id = %(workspace_id)s
AND deleted_at IS NULL;
"""

find_member_by_nickname = """
SELECT * FROM workspace_members WHERE nickname = %(nickname)s;
"""

# note: 명훈 추가
find_member_by_workspace_columns = """
SELECT COLUMN_NAME
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'workspace_members';
"""

class QueryRepo(AbstractQueryRepo):
    def __init__(self):
        db = DBFactory.get_db("MySQL")
        super().__init__(db)

    def save_file_to_db(self, data: dict):
        return self.db.execute(insert_file, data)

    def find_file_by_message_id(self, data: dict):
        return self.db.execute(find_file_by_message_id, data)

    def find_by_email(self, email: str) -> WorkspaceMember:
        param = {
            "email": email
        }
        return self.db.execute(find_member_by_email, param)
    
    def find_members_by_group_id(self, group_id: int):
        param = {
            "group_id": group_id
        }
        return self.db.execute(find_members_by_group_id, param)
    
    def find_by_nickname(self, nickname: str) -> WorkspaceMember:
        param = {
            "nickname": nickname
        }
        return self.db.execute(find_member_by_nickname, param)

    def find_by_workspace_columns(self):
        return self.db.execute(find_member_by_workspace_columns)