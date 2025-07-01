from BE.app.util.database.abstract_query_repo import AbstractQueryRepo

find_all_user = """
SELECT * FROM user;
"""

find_user_by_email = """
SELECT * FROM user WHERE email = %(user_email)s
"""

find_user_by_provider_id_and_email = """
SELECT * FROM user WHERE provider_id = %(user_provider_id)s
                     AND email = %(user_email)s
"""

find_user_by_email_and_update_provider_id = """
UPDATE user SET provider_id = %(provider_id)s 
            WHERE email = %(user_email)s;
"""

save_refresh_token = """
INSERT INTO refreshToken VALUE(%(user_refresh_token)s)
"""

find_refresh_token_by_refresh_token = """
SELECT * FROM user WHERE email = %(user_refresh_token)s
"""

class QueryRepo(AbstractQueryRepo):
    def __init__(self):
        super().__init__()
        self.queries["find_all_user"] = find_all_user
        self.queries["find_user_by_email"] = find_user_by_email
        self.queries["find_user_by_provider_id_and_email"] = find_user_by_provider_id_and_email
        self.queries["find_user_by_email_and_update_provider_id"] = find_user_by_email_and_update_provider_id
        self.queries["save_refresh_token"] = save_refresh_token