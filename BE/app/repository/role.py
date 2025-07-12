from app.util.database.db_factory import DBFactory
from app.util.database.abstract_query_repo import AbstractQueryRepo

select_roles = """
select id, name from roles;
"""

class RolesRepository(AbstractQueryRepo):
    def __init__(self):
        db = DBFactory.get_db("MySQL")
        super().__init__(db)

    def get_all_roles(self):
        return self.db.execute(select_roles)

