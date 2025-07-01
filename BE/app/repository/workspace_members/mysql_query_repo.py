from BE.app.util.database.abstract_query_repo import AbstractQueryRepo

find_all_workspace_members = """
SELECT * FROM workspace_members;
"""

class QueryRepo(AbstractQueryRepo):
    def __init__(self):
        super().__init__()
        self.queries["find_all_workspace_members"] = find_all_workspace_members
    