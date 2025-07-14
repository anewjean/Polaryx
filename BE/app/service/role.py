from typing import List
import logging
from app.repository.role import QueryRepo as RolesRepo
from app.domain.role import Role
from app.core.exceptions import (
    NotFoundException,
    BadRequestException,
    InternalServerException
)

from uuid import UUID

class RoleService:
    def __init__(self):
        self.repo = RolesRepo()

    def insert_member_roles(self, data: dict):
        return self.repo.insert_member_roles(data)

    def find_all(self, workspace_id: int) -> List[Role]:
        try:
            rows = self.repo.find_all(workspace_id)
            return [Role.from_row(row) for row in rows]
        except Exception as e:
            logging.error(f"역할 목록 조회 서비스 오류 - workspace_id: {workspace_id}, error: {e}")
            raise InternalServerException("역할 목록을 조회하는 중 오류가 발생했습니다")

    def find(self, workspace_id: int, role_id: int) -> Role:
        try:
            row = self.repo.find(workspace_id, role_id)
            return Role.from_row(row)
        except ValueError as e:
            raise NotFoundException(f"역할을 찾을 수 없습니다 - role_id: {role_id}")
        except Exception as e:
            logging.error(f"역할 조회 서비스 오류 - role_id: {role_id}, workspace_id: {workspace_id}, error: {e}")
            raise InternalServerException("역할을 조회하는 중 오류가 발생했습니다")
    
    def create(self, workspace_id: int, role_name: str, permissions: List) -> Role:        
        try:
            self.repo.insert(workspace_id, role_name, permissions)
            row = self.repo.find_by_name(workspace_id, role_name)
            return Role.from_row(row)
        except ValueError as e:
            if "이미 존재합니다" in str(e):
                raise BadRequestException(f"같은 이름의 역할이 이미 존재합니다 - role_name: {role_name}")
            else:
                raise NotFoundException(str(e))
        except Exception as e:
            logging.error(f"역할 생성 서비스 오류 - role_name: {role_name}, workspace_id: {workspace_id}, error: {e}")
            raise InternalServerException("역할을 생성하는 중 오류가 발생했습니다")

    def modify(self, workspace_id: int, role_id: int, role_name: str, permissions: List) -> Role:
        try:
            self.repo.update(workspace_id, role_id, role_name, permissions)
            row = self.repo.find(workspace_id, role_id)
            return Role.from_row(row)
        except ValueError as e:
            raise NotFoundException(f"수정할 역할을 찾을 수 없습니다 - role_id: {role_id}")
        except Exception as e:
            logging.error(f"역할 수정 서비스 오류 - role_id: {role_id}, workspace_id: {workspace_id}, error: {e}")
            raise InternalServerException("역할을 수정하는 중 오류가 발생했습니다")

    def delete(self, workspace_id: int, role_id: int) -> None:
        try:
            self.repo.delete(workspace_id, role_id)
        except ValueError as e:
            raise NotFoundException(f"삭제할 역할을 찾을 수 없습니다 - role_id: {role_id}")
        except Exception as e:
            logging.error(f"역할 삭제 서비스 오류 - role_id: {role_id}, workspace_id: {workspace_id}, error: {e}")
            raise InternalServerException("역할을 삭제하는 중 오류가 발생했습니다")

    # 미완
    def delete_member_roles(self, user_id: str, workspace_id: int) -> bool:
        result = self.repo.delete_mem_role(UUID(user_id).bytes, workspace_id)
        return result