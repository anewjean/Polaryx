from fastapi import APIRouter
from typing import List

from app.service.role import RoleService
from app.schema.role.request import CreateRoleRequest, ModifyRoleRequest, DeleteRoleRequest
from app.schema.role.response import RoleResponse


router = APIRouter(prefix="/workspaces")
role_service = RoleService()

# 전체 역할 리스트 조회
@router.get("/{workspace_id}/roles", response_model=List[RoleResponse])
async def get_roles(workspace_id: int):
    roles = role_service.find_all(workspace_id)
    return [RoleResponse.from_domain(role) for role in roles]

# 역할별 권한 조회
@router.get("/{workspace_id}/roles/{role_id}", response_model=RoleResponse)
async def get_role(workspace_id: int, role_id: int):
    role = role_service.find(workspace_id, role_id)
    return RoleResponse.from_domain(role)

# 역할별 권한 생성
@router.post("/{workspace_id}/roles", response_model=RoleResponse)
async def create_role(workspace_id: int, dto: CreateRoleRequest):
    role = role_service.create(workspace_id, dto.name, dto.permissions)
    return RoleResponse.from_domain(role)

# 역할별 권한 수정
@router.patch("/{workspace_id}/roles/{role_id}", response_model=RoleResponse)
async def modify_role(workspace_id: int, role_id: int, dto: ModifyRoleRequest):
    role = role_service.modify(workspace_id, role_id, dto.name, dto.permissions)
    return RoleResponse.from_domain(role)

# 역할별 권한 삭제
@router.delete("/{workspace_id}/roles/{role_id}")
async def delete_role(workspace_id: int, role_id: int):
    role_service.delete(workspace_id, role_id)
    return {"message": "역할이 성공적으로 삭제되었습니다"}