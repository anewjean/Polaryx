from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
import logging
from typing import Union

from app.core.exceptions import (
    DatabaseError,
    ConnectionError as DBConnectionError,
    QueryExecutionError,
    DataNotFoundError,
    DataValidationError,
    DuplicateDataError,
    RoleError,
    RoleNotFoundError,
    RoleAlreadyExistsError,
    InvalidPermissionError
)


async def database_error_handler(request: Request, exc: DatabaseError) -> JSONResponse:
    """데이터베이스 관련 에러 처리"""
    logging.error(f"Database error on {request.url}: {exc.message}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "데이터베이스 오류",
            "message": "데이터베이스 처리 중 오류가 발생했습니다",
            "detail": exc.message
        }
    )


async def connection_error_handler(request: Request, exc: DBConnectionError) -> JSONResponse:
    """데이터베이스 연결 에러 처리"""
    logging.error(f"Database connection error on {request.url}: {exc.message}")
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "error": "서비스 일시 중단",
            "message": "데이터베이스에 연결할 수 없습니다. 잠시 후 다시 시도해주세요",
            "detail": exc.message
        }
    )


async def query_execution_error_handler(request: Request, exc: QueryExecutionError) -> JSONResponse:
    """쿼리 실행 에러 처리"""
    logging.error(f"Query execution error on {request.url}: {exc.message}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "처리 실패",
            "message": "요청을 처리할 수 없습니다",
            "detail": exc.message
        }
    )


async def data_not_found_error_handler(request: Request, exc: DataNotFoundError) -> JSONResponse:
    """데이터 없음 에러 처리"""
    logging.warning(f"Data not found on {request.url}: {exc.message}")
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={
            "error": "데이터 없음",
            "message": "요청한 데이터를 찾을 수 없습니다",
            "detail": exc.message
        }
    )


async def duplicate_data_error_handler(request: Request, exc: DuplicateDataError) -> JSONResponse:
    """중복 데이터 에러 처리"""
    logging.warning(f"Duplicate data error on {request.url}: {exc.message}")
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content={
            "error": "중복 데이터",
            "message": "이미 존재하는 데이터입니다",
            "detail": exc.message
        }
    )


async def data_validation_error_handler(request: Request, exc: DataValidationError) -> JSONResponse:
    """데이터 유효성 검증 에러 처리"""
    logging.warning(f"Data validation error on {request.url}: {exc.message}")
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "error": "잘못된 요청",
            "message": "입력 데이터가 올바르지 않습니다",
            "detail": exc.message
        }
    )


async def role_not_found_error_handler(request: Request, exc: RoleNotFoundError) -> JSONResponse:
    """역할 없음 에러 처리"""
    logging.warning(f"Role not found on {request.url}: {exc.message}")
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={
            "error": "역할 없음",
            "message": "요청한 역할을 찾을 수 없습니다",
            "detail": exc.message
        }
    )


async def role_already_exists_error_handler(request: Request, exc: RoleAlreadyExistsError) -> JSONResponse:
    """역할 중복 에러 처리"""
    logging.warning(f"Role already exists on {request.url}: {exc.message}")
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content={
            "error": "역할 중복",
            "message": "같은 이름의 역할이 이미 존재합니다",
            "detail": exc.message
        }
    )


async def invalid_permission_error_handler(request: Request, exc: InvalidPermissionError) -> JSONResponse:
    """잘못된 권한 에러 처리"""
    logging.warning(f"Invalid permission error on {request.url}: {exc.message}")
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "error": "잘못된 권한",
            "message": "유효하지 않은 권한입니다",
            "detail": exc.message
        }
    )


async def role_error_handler(request: Request, exc: RoleError) -> JSONResponse:
    """역할 관련 일반 에러 처리"""
    logging.error(f"Role error on {request.url}: {exc.message}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "역할 처리 오류",
            "message": "역할 처리 중 오류가 발생했습니다",
            "detail": exc.message
        }
    )


async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """예상치 못한 모든 에러 처리"""
    logging.error(f"Unexpected error on {request.url}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "서버 내부 오류",
            "message": "예상치 못한 오류가 발생했습니다",
            "detail": "서버 관리자에게 문의하세요"
        }
    )