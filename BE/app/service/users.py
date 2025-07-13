from app.util.database.db_factory import DBFactory
from app.repository.auth.mysql_query_repo import QueryRepo

db = DBFactory.get_db("MYSQL")
UserRepo = QueryRepo()


class UserService:
    def find_user_by_email(self, user_email: str):        
        params = {"user_email": user_email, 
                  }

        # 일단 email로 먼저 찾아내기.
        sql = UserRepo.get_sql("find_user_by_email")
        result = db.execute(sql, params)

        # 만약 email과 일치하는 회원이 없다면 바로 짤.
        if not result:
            print("\n\n email과 일치하는 회원이 없다.")
            return None
        else:
            print("\n\n email이 이미 있음.")
            return result
        
    def create_user_in_usertable(self, data: dict):
        # 일단 email로 먼저 찾아내기.
        sql = UserRepo.get_sql("insert_user")
        db.execute(sql, data)

                