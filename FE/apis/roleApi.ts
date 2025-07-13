const BASE = process.env.NEXT_PUBLIC_BASE;

import { fetchWithAuth } from "./authApi";
import { Member } from "./tabApi";

export interface Role {
  role_id: number;
  role_name: string;
  members?: Member[];
  non_members?: Member[];  
  group_name?: string[];
  non_group_name?: string[];
  group_id?: number[];
  non_group_id?: number[];
  permissions?: string[];
}

// 역할 조회
export const getRoles = async (workspaceId: string): Promise<Role[]> => {
    // const res = await fetchWithAuth(`${BASE}/api/workspaces/${workspaceId}/roles`, {
    //     method: "GET",
    //     headers: { Accept: "application/json" },
    // });

    // if (res && res.ok) {
    //     return res.json();
    // }

    /////////////////// 일단 더미 데이터 반환/////////////////////////
    return getDummyRoles(workspaceId);
}

// 더미 역할 데이터 생성 함수
function getDummyRoles(workspaceId: string): Role[] {
  const workspaceIdNum = parseInt(workspaceId) || 1;
  
  // 더미 멤버 생성
  const dummyMembers: Member[] = [
    {
      user_id: "user1", 
      nickname: "김관리자",
      image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
      role_name: "admin",
      group_name: ["개발팀", "기획팀"],
      group_id: [1, 2]
    },
    {
      user_id: "user2",
      nickname: "이사용자",
      image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka",
      role_name: "member",
      group_name: ["개발팀"],
      group_id: [1]
    },
    {
      user_id: "user3",
      nickname: "박멤버",
      image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Dusty",
      role_name: "member",
      group_name: ["디자인팀"],
      group_id: [3]
    },
    {
      user_id: "user4",
      nickname: "최사용자",
      image: null,
      role_name: "member",
      group_name: [],
      group_id: []
    }
  ];
  
  const dummyRoles: Role[] = [
    {
      role_id: 1,
      role_name: "admin",
      members: [dummyMembers[0]],
      non_members: [dummyMembers[1], dummyMembers[2], dummyMembers[3]],
      group_name: ["개발팀", "기획팀", "디자인팀"],
      non_group_name: ["마케팅팀", "인사팀"],
      group_id: [1, 2, 3],
      non_group_id: [4, 5],
      permissions: ["모든 권한", "사용자 관리", "역할 관리", "그룹 관리"]
    },
    {
      role_id: 2,
      role_name: "member",
      members: [dummyMembers[1], dummyMembers[2], dummyMembers[3]],
      non_members: [dummyMembers[0]],
      group_name: ["개발팀", "디자인팀"],
      non_group_name: ["기획팀", "마케팅팀", "인사팀"],
      group_id: [1, 3],
      non_group_id: [2, 4, 5],
      permissions: ["메시지 작성", "파일 업로드"]
    }
  ];
  
  return dummyRoles;
}
  

// 역할별 권한 조회
export const getRoleById = async (workspaceId: string, roleId: string) => {
  const res = await fetchWithAuth(`${BASE}/api/workspaces/${workspaceId}/roles/${roleId}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  if (res == null || !res.ok) throw new Error("역할 조회에 실패했습니다.");
  return res.json();
};

// 역할별 권한 생성
export const createRole = async (
  workspaceId: string,
  roleName: string,
  rolePermission: any,
) => {
  const res = await fetchWithAuth(`${BASE}/api/workspaces/${workspaceId}/roles`, {
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
  const res = await fetchWithAuth(`${BASE}/api/workspaces/${workspaceId}/roles`, {
    method: "PATCH",
    body: JSON.stringify({
      role_name: roleName,
      role_permission: rolePermission,
    }),
  });
};

// 역할 삭제
export const deleteRole = async (workspaceId: string, roleName: string) => {
  const res = await fetchWithAuth(`${BASE}/api/workspaces/${workspaceId}/roles/delete`, {
    method: "PATCH",
    body: JSON.stringify({ role_name: roleName }),
  });
};
