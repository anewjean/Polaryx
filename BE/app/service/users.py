from app.util.database.db_factory import DBFactory
from app.repository.auth.mysql_query_repo import QueryRepo
from uuid import uuid4

db = DBFactory.get_db("MYSQL")
user_repo = QueryRepo()


class UserService:

    def find_user_by_email(self, user_email: str):        
        params = {"user_email": user_email, 
                  }

        # 일단 email로 먼저 찾아내기.
        sql = user_repo.get_sql("find_user_by_email")
        result = db.execute(sql, params)

        # 만약 email과 일치하는 회원이 없다면 바로 짤.
        if not result:
            print("\n\n email과 일치하는 회원이 없다.")
            return None
        else:
            print("\n\n email이 이미 있음.")
            return result
        
    def create_users_bulk(self, data: dict, workspace_id: int):
        user_list = []
        for user_data in data["users"]:
            user_list.append({
                "email": user_data["email"],
                "name": user_data["name"],
                "provider": "google",
                "workspace_id": workspace_id,
                "id": uuid4().bytes
            })
        
        # 한 번에 모든 사용자 삽입
        return user_repo.bulk_insert_users(user_list)


                