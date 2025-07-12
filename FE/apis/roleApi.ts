const BASE = process.env.NEXT_PUBLIC_BASE;

import { fetchWithAuth } from "./authApi";

const request = async (
  path: string,
  options: RequestInit = {},
): Promise<any> => {
  const response = await fetchWithAuth(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (response == null) {
    console.log("NOT REACH");
    return;
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "서버 에러");
  }

  // No Content (204) 이면 JSON 파싱 대신 null 반환
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

// 역할 리스트 조회
export const getRoles = async (workspaceId: string) => {
  return request(`${BASE}/api/workspaces/${workspaceId}/roles`, {
    method: "GET",
  });
};

// 역할별 권한 조회
export const getRoleById = async (workspaceId: string, roleId: string) => {
  return request(`${BASE}/api/workspaces/${workspaceId}/roles/${roleId}`, {
    method: "GET",
  });
};

// 역할별 권한 생성
export const createRole = async (
  workspaceId: string,
  roleName: string,
  rolePermission: any,
) => {
  return request(`${BASE}/api/workspaces/${workspaceId}/roles`, {
    method: "POST",
    body: JSON.stringify({
      role_name: roleName,
      role_permission: rolePermission,
    }),
  });
};

// 역할별 권한 수정
export const updateRole = async (
  workspaceId: string,
  roleName: string,
  rolePermission: any,
) => {
  return request(`${BASE}/api/workspaces/${workspaceId}/roles`, {
    method: "PATCH",
    body: JSON.stringify({
      role_name: roleName,
      role_permission: rolePermission,
    }),
  });
};

// 역할 삭제
export const deleteRole = async (workspaceId: string, roleName: string) => {
  return request(`${BASE}/api/workspaces/${workspaceId}/roles/delete`, {
    method: "PATCH",
    body: JSON.stringify({ role_name: roleName }),
  });
};
