# 엑세스 토큰 확인하는 로직
# (모든 라우터에 depends)
from fastapi import HTTPException, Request
from jose import JWTError, jwt, ExpiredSignatureError
import os

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

def is_token_expired(token: str) -> bool:
    try:
        jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        return False
    except ExpiredSignatureError:
        return True
    
def is_token_bad(token: str) -> bool:
    try:
        jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        return False
    except JWTError:
        return True

# 토큰 유효성 검사
def verify_token_and_get_token_data(request: Request) -> dict:
    # 먼저 요청 헤더의 authorization을 확인해보고,
    token = request.headers.get("Authorization")
    
    # 토큰이 거기에 존재하지 않으면 401, NO ACCESS TOKEN PROVIDED 에러
    if not token:
        raise HTTPException(status_code=401, detail="NO ACCESS TOKEN PROVIDED")
    
    # 일단 존재하면, 토큰이 정상적인지 확인
    if not is_token_bad(token):
        raise HTTPException(status_code=401, detail="INVALID TOKEN")

    # 그리고 만료되지 않았는지 확인
    if not is_token_expired(token):
        raise HTTPException(status_code=401, detail="EXPIRE TOKEN")            
            
    # 문제 없으면 payload 에서 뽑아낸, 토큰에 들어있던 데이터 반환.
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    result = {"user_id": payload.get("user_id"), "email": payload.get("email")}

    return result