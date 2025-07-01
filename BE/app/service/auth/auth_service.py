import jwt
from datetime import datetime, timedelta, UTC
import os
from BE.app.util.database.db_factory import DBFactory
from BE.app.repository.auth.mysql_query_repo import QueryRepo


SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


class AuthService:

    # 로그인2(토큰 재발급?? 언제하는거임?)
    # JWT 구조에서는 2개의 토큰을 사용함.
    # 1. access(유효시간 짧음, API 인증용)
    # 2. refresh(유효시간 긺, access 토큰 재발급용)
    # 만약 access 토큰의 유효시간이 끝났는데, refresh는 아니다?
    # -> 그럼 재발급.

    def find_db(user_email):
        db = DBFactory.get_db("MYSQL")
        query_repo = QueryRepo()
        
        params = {"user_email": user_email}
        sql = query_repo.get_sql("find_user_by_email")
        
        result = db.execute(sql, params)
        
        return result


    
class TokenSerive:

    
    # 토큰 관련(JWT 생성 / 검증)
    # -> 소셜 로그인을 통한 회원과, 직접 회원가입한 회원은 다른 토큰 사용.
    # 만약 직접 회원가입했다? -> 그럼 자체 토큰 사용해야됨.
    # 근데 소셜 로그인이다? -> 그럼 그 소셜에서 발급한 ID 토큰 사용.
    # 그래서 인증 방식이 다르기 때문에 둘을 나눠서 구현.
    # 그렇다고 소셜 토큰으로 모든걸 해결할 수 없음.
    # 소셜 로그인도 자체 토큰이 필요함.
    def create_access_token(data: dict, expires_delta: timedelta | None = None):
        to_encode = data.copy()

        expire = datetime.now(UTC) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
        to_encode.update({"exp": expire})

        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    # 소셜 토큰과 자체 토큰의 차이점
    # 1. 소셜 토큰: 소셜 사용자 인증
    # 2. 자체 토큰: 서비스 내 로그인 유지

    # 소셜 로그인 토큰 검증

    def social_token():
        return
    
    
    # 유효성 검사(사용자 상태 검사(탈퇴, 비활), 소셜 토큰 정보 검사)

