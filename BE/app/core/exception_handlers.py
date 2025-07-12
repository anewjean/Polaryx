import logging
from typing import Union
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.core.exceptions import CustomHTTPException

logger = logging.getLogger(__name__)


async def custom_http_exception_handler(request: Request, exc: CustomHTTPException) -> JSONResponse:
    """커스텀 HTTP 예외 처리"""
    error_response = {
        "error": True,
        "message": exc.detail,
        "status_code": exc.status_code
    }
    
    if exc.error_code:
        error_response["error_code"] = exc.error_code.value
    
    logger.error(f"Custom HTTP Exception: {exc.status_code} - {exc.detail}")
    
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response
    )


async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    """일반 HTTP 예외 처리"""
    error_response = {
        "error": True,
        "message": exc.detail,
        "status_code": exc.status_code
    }
    
    logger.error(f"HTTP Exception: {exc.status_code} - {exc.detail}")
    
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """유효성 검사 예외 처리"""
    error_details = []
    for error in exc.errors():
        error_details.append({
            "field": " -> ".join(str(loc) for loc in error["loc"]),
            "message": error["msg"],
            "type": error["type"]
        })
    
    error_response = {
        "error": True,
        "message": "Validation Error",
        "status_code": status.HTTP_422_UNPROCESSABLE_ENTITY,
        "details": error_details
    }
    
    logger.error(f"Validation Exception: {error_details}")
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=error_response
    )


async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """일반 예외 처리 (예상하지 못한 오류)"""
    error_response = {
        "error": True,
        "message": "Internal Server Error",
        "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR
    }
    
    logger.error(f"Unexpected Exception: {type(exc).__name__} - {str(exc)}", exc_info=True)
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=error_response
    )