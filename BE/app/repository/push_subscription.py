from app.util.database.abstract_query_repo import AbstractQueryRepo
from app.util.database.db_factory import DBFactory

insert_subscription = """
INSERT INTO push_subscriptions (
    user_id, endpoint, p256dh, auth
) VALUES (
    %(user_id)s, %(endpoint)s, %(p256dh)s, %(auth)s
) ON DUPLICATE KEY UPDATE
    user_id = VALUES(user_id),
    p256dh = VALUES(p256dh),
    auth = VALUES(auth);
"""

find_all_subscriptions = """
SELECT
    LOWER(HEX(user_id)) AS user_id,
    endpoint,
    p256dh,
    auth
FROM push_subscriptions;

"""

find_by_user = """
SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE user_id = %(user_id)s;
"""

class QueryRepo(AbstractQueryRepo):
    def __init__(self):
        db = DBFactory.get_db("MySQL")
        super().__init__(db)

    def insert(self, data: dict):
        return self.db.execute(insert_subscription, data)

    def find_all(self):
        return self.db.execute(find_all_subscriptions)

    def find_user(self, user_id: bytes):
        return self.db.execute(find_by_user, {"user_id": user_id})
