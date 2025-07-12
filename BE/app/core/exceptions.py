from fastapi import HTTPException, status
from app.core.error_codes import ErrorCode


class CustomHTTPException(HTTPException):
    def __init__(self, status_code: int, error_code: ErrorCode, detail: str = None):
        self.error_code = error_code
        super().__init__(status_code=status_code, detail=detail or error_code.value)


class UnauthorizedException(CustomHTTPException):
    def __init__(self, error_code: ErrorCode = ErrorCode.UNAUTHORIZED, detail: str = None):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            error_code=error_code,
            detail=detail
        )


class ForbiddenException(CustomHTTPException):
    def __init__(self, error_code: ErrorCode = ErrorCode.FORBIDDEN, detail: str = None):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            error_code=error_code,
            detail=detail
        )


class BadRequestException(CustomHTTPException):
    def __init__(self, detail: str = "Bad Request"):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            error_code=None,
            detail=detail
        )


class NotFoundException(CustomHTTPException):
    def __init__(self, detail: str = "Not Found"):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            error_code=None,
            detail=detail
        )


class ValidationException(CustomHTTPException):
    def __init__(self, detail: str = "Validation Error"):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            error_code=None,
            detail=detail
        )


class InternalServerException(CustomHTTPException):
    def __init__(self, detail: str = "Internal Server Error"):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            error_code=None,
            detail=detail
        )
