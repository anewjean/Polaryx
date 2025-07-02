from BE.app.repository.workspace_members.mysql_query_repo import QueryRepo
from BE.app.util.database.abstract_query_repo import get_connection
from BE.app.schema.workspace_members.request import UpdateWorkspaceMemberRequest  # 이거도 꼭 import 해줘야 함
from BE.app.schema.workspace_members.response import WorkspaceMemberResponse     # get_profile 사용 중이면 이것도 필요

class WorkspaceMembersService:
    def __init__(self):
        self.query_repo = QueryRepo()
        
    def get_all_members(self):
        query = self.query_repo.queries["find_all_workspace_members"]
        with get_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(query)
                return cursor.fetchall()
            
    def get_profile(self, workspace_member_id: bytes) -> WorkspaceMemberResponse:
        query = self.query_repo.queries["find_workspace_member_by_id"]
        with get_connection() as connection:
            with connection.cursor(dictionary=True) as cursor:
                cursor.execute(query, (workspace_member_id,))
                result = cursor.fetchone()
                print(result["image"])
                if result is None:
                    raise ValueError("해당 맴버를 찾을 수 없습니다.")
                
                result['id'] = result['id'].hex()
                result["user_id"] = result["user_id"].hex()
                
                
                return WorkspaceMemberResponse(**result)
        
    
    def update_profile(self, workspace_member_id: bytes, update_data: UpdateWorkspaceMemberRequest):
        query = """
            UPDATE workspace_members
            SET 
                nickname = IFNULL(%s, nickname),
                github = IFNULL(%s, github),
                blog = IFNULL(%s, blog),
                image = IFNULL(%s, image),
                phone = IFNULL(%s, phone),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
        """
        values = (
            update_data.nickname,
            update_data.github,
            update_data.blog,
            update_data.image,
            update_data.phone,
            workspace_member_id
        )

        with get_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(query, values)
                connection.commit()
        
        return self.get_profile(workspace_member_id)