from app.util.database.db_factory import DBFactory
from app.util.database.abstract_query_repo import AbstractQueryRepo

select_roles = """
select id, name from roles;
"""

insert_member_roles = """
INSERT INTO member_roles (
    user_id,
    user_name,
    role_id
)
SELECT %(user_id)s   AS user_id,
       %(user_name)s AS user_name,
       r.id          AS role_id
FROM roles r
WHERE r.name = %(role_name)s;
"""

class QueryRepo(AbstractQueryRepo):
    def __init__(self):
        db = DBFactory.get_db("MySQL")
        super().__init__(db)

    def get_all_roles(self):
        return self.db.execute(select_roles)

    def insert_member_roles(self, data: dict):
        params = {
            "user_id": data["user_id"],
            "user_name": data["nickname"],
            "role_name": data["role"]
        }
        return self.db.execute(insert_member_roles, params)