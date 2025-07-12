from typing import Optional


class DatabaseError(Exception):
    """데이터베이스 관련 기본 예외"""
    def __init__(self, message: str, original_error: Optional[Exception] = None):
        self.message = message
        self.original_error = original_error
        super().__init__(self.message)


class ConnectionError(DatabaseError):
    """데이터베이스 연결 오류"""
    pass


class QueryExecutionError(DatabaseError):
    """쿼리 실행 오류"""
    pass


class DataNotFoundError(DatabaseError):
    """데이터를 찾을 수 없음"""
    pass


class DataValidationError(DatabaseError):
    """데이터 유효성 검증 오류"""
    pass


class DuplicateDataError(DatabaseError):
    """중복 데이터 오류"""
    pass


class RoleError(Exception):
    """역할 관련 기본 예외"""
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)


class RoleNotFoundError(RoleError):
    """역할을 찾을 수 없음"""
    pass


class RoleAlreadyExistsError(RoleError):
    """역할이 이미 존재함"""
    pass


class InvalidPermissionError(RoleError):
    """잘못된 권한"""
    pass