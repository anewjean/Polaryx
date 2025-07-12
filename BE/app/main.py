from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse
from urllib.parse import urlencode
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

from app.router import message
from app.router.auth import auth_controller as auth
from app.router import workspace_members
from app.router import workspace
from app.router import s3
from app.router import tab
from app.router import ws_message
from app.router import direct_message
from app.router import db

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
from app.core.exception_handlers import (
    database_error_handler,
    connection_error_handler,
    query_execution_error_handler,
    data_not_found_error_handler,
    duplicate_data_error_handler,
    data_validation_error_handler,
    role_not_found_error_handler,
    role_already_exists_error_handler,
    invalid_permission_error_handler,
    role_error_handler,
    general_exception_handler
)

load_dotenv()

app = FastAPI()

# 전역 예외 핸들러 등록
app.add_exception_handler(DBConnectionError, connection_error_handler)
app.add_exception_handler(QueryExecutionError, query_execution_error_handler)
app.add_exception_handler(DataNotFoundError, data_not_found_error_handler)
app.add_exception_handler(DuplicateDataError, duplicate_data_error_handler)
app.add_exception_handler(DataValidationError, data_validation_error_handler)
app.add_exception_handler(RoleNotFoundError, role_not_found_error_handler)
app.add_exception_handler(RoleAlreadyExistsError, role_already_exists_error_handler)
app.add_exception_handler(InvalidPermissionError, invalid_permission_error_handler)
app.add_exception_handler(RoleError, role_error_handler)
app.add_exception_handler(DatabaseError, database_error_handler)
app.add_exception_handler(Exception, general_exception_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://3.36.61.200:3000", "http://jungle-lms.site:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router=ws_message.router, prefix="/api/ws")
app.include_router(router=message.router, prefix="/api")
app.include_router(router=auth.router, prefix="/api")
app.include_router(router=s3.router, prefix="/api")

app.include_router(router=workspace_members.router, prefix="/api")
app.include_router(router=tab.router, prefix="/api")
app.include_router(router=workspace.router, prefix="/api")
app.include_router(router=direct_message.router, prefix="/api")
app.include_router(router=db.router, prefix="/api")









