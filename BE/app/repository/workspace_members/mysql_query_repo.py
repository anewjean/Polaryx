from BE.app.util.database.abstract_query_repo import AbstractQueryRepo

find_all_workspace_members = """
SELECT * FROM workspace_members;
"""

find_workspace_members_by_id = """
SELECT id, nickname, email, github, blog, image
FROM workspace_members
WHERE id = %s AND deleted_at IS NULL;"""

class QueryRepo(AbstractQueryRepo):
    def __init__(self):
        super().__init__()
        self.queries["find_all_workspace_members"] = find_all_workspace_members
        self.queries["find_workspace_member_by_id"] = find_workspace_members_by_id
    