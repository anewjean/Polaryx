from app.util.database.db_factory import DBFactory
from app.repository.auth.mysql_query_repo import QueryRepo

db = DBFactory.get_db("MYSQL")
UserRepo = QueryRepo()


class UserService:
    def find_user_by_email(user_email: str):        
        params = {"user_email": user_email, 
                  }

        # 일단 email로 먼저 찾아내기.
        sql = UserRepo.get_sql("find_user_by_email")
        result = db.execute(sql, params)

        # 만약 email과 일치하는 회원이 없다면 바로 짤.
        if not result:
            print("\n\n email과 일치하는 회원이 없다.")
            return None
        
        # email을 통해 데이터를 찾아오긴 했지만,
        # provider_id 가 존재하지 않는 경우, 즉 처음으로 로그인 했을 때,
        # provider_id와 id 업데이트
        if not result[0][4]:
            print("\n\n 회원의 provider_id가 없다? id 다시 세팅")
            sql = query_repo.get_sql("update_provider_id_and_id")
            db.execute(sql, params)
            sql = query_repo.get_sql("update_user_id_in_workspace_members")
            db.execute(sql, params)

        # 만약 provider_id도 존재하지만, 접근 시도하는 데이터의
        # provider_id와 다른것도 짤.
        elif result[0][4] != params["user_provider_id"]:
            print("\n\n provider_id가 일치하지 않는다.")
            return None
        
        # 위 사항들에 해당되지 않는다면, 다시 provider_id와 email로 제대로 찾아와서 반환
        sql = query_repo.get_sql("find_user_by_provider_id_and_email")
        result = db.execute(sql, params)
        return result

        
