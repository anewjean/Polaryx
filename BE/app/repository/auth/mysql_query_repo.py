from BE.app.util.database.abstract_query_repo import AbstractQueryRepo

find_all_user = """
SELECT * FROM user;
"""

find_user_by_id = """
SELECT * FROM user WHERE id = %(user_id)s
"""

find_user_by_email = """
SELECT * FROM user WHERE email = %(user_email)s
"""

class QueryRepo(AbstractQueryRepo):
    def __init__(self):
        super().__init__()
        self.queries["find_all_user"] = find_all_user
        self.queries["find_user_by_id"] = find_user_by_id
        self.queries["find_user_by_email"] = find_user_by_email