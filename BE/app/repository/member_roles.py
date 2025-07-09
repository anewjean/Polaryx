from app.util.database.db_factory import DBFactory
from app.util.database.abstract_query_repo import AbstractQueryRepo

insert_member_roles = """
insert into member_roles (user_id, user_name, role_id) values (%s, %s, %s);
"""

class MemberRolesRepository(AbstractQueryRepo):
    def __init__(self):
        db = DBFactory.get_db("MySQL")
        super().__init__(db)

    def insert_member_roles(self, user_id: str, user_name: str, role_id: int):
        return self.db.execute(insert_member_roles, (user_id, user_name, role_id))