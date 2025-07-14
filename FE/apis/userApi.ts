import { fetchWithAuth } from "./authApi";
import { Profile } from "./profileApi";

const BASE = process.env.NEXT_PUBLIC_BASE;

/* 워크스페이스 유저 조회 */
export async function getUsers(workspaceId: string): Promise<Profile[]> {  

    const res = await fetchWithAuth(`${BASE}/api/workspaces/${workspaceId}/users`, {
        method: "GET",
        headers: { Accept: "application/json" },
    });

    if (res && res.ok) {
        return res.json();
    }

    /////////////////// 일단 더미 데이터 반환/////////////////////////
    return getDummyUsers(workspaceId);
}

// 더미 유저 데이터 생성 함수
function getDummyUsers(workspaceId: string): Profile[] {
  const workspaceIdNum = parseInt(workspaceId) || 1;
  
  const dummyUsers: Profile[] = [
    {
      user_id: "user_001",
      workspace_id: workspaceIdNum,
      nickname: "김철수",
      email: "chulsoo.kim@example.com",
      image: "https://data1.pokemonkorea.co.kr/newdata/pokedex/full/000101.png",
      role_name: "admin",
      group_name: ["개발팀", "기획팀"],
      group_id: [1, 2],
      github: "chulsoo-kim",
      blog: "https://blog.chulsoo.com"
    },
    {
      user_id: "user_002",
      workspace_id: workspaceIdNum,
      nickname: "이영희",
      email: "younghee.lee@example.com",
      image: "https://data1.pokemonkorea.co.kr/newdata/pokedex/full/000501.png",
      role_name: "member",
      group_name: ["디자인팀"],
      group_id: [3],
      github: "younghee-lee",
      blog: "https://blog.younghee.com"
    },
    {
      user_id: "user_003",
      workspace_id: workspaceIdNum,
      nickname: "박지민",
      email: "jimin.park@example.com",
      image: "https://data1.pokemonkorea.co.kr/newdata/pokedex/full/000701.png",
      role_name: "member",
      group_name: ["마케팅팀", "기획팀"],
      group_id: [4, 2],
      github: null,
      blog: null
    },
    {
      user_id: "user_004",
      workspace_id: workspaceIdNum,
      nickname: "최수진",
      email: "sujin.choi@example.com",
      image: "https://data1.pokemonkorea.co.kr/newdata/pokedex/full/000601.png",
      role_name: "member",
      group_name: ["개발팀"],
      group_id: [1],
      github: "sujin-dev",
      blog: "https://tech.sujin.com"
    },
    {
      user_id: "user_005",
      workspace_id: workspaceIdNum,
      nickname: "정민준",
      email: "minjun.jung@example.com",
      image: "https://data1.pokemonkorea.co.kr/newdata/pokedex/full/000401.png",
      role_name: "member",
      group_name: ["인사팀"],
      group_id: [5],
      github: null,
      blog: "https://blog.minjun.com"
    },
    {
        user_id: "user_001",
        workspace_id: workspaceIdNum,
        nickname: "김철수",
        email: "chulsoo.kim@example.com",
        image: "https://data1.pokemonkorea.co.kr/newdata/pokedex/full/000101.png",
        role_name: "admin",
        group_name: ["개발팀", "기획팀"],
        group_id: [1, 2],
        github: "chulsoo-kim",
        blog: "https://blog.chulsoo.com"
      },
      {
        user_id: "user_002",
        workspace_id: workspaceIdNum,
        nickname: "이영희",
        email: "younghee.lee@example.com",
        image: "https://data1.pokemonkorea.co.kr/newdata/pokedex/full/000501.png",
        role_name: "member",
        group_name: ["디자인팀"],
        group_id: [3],
        github: "younghee-lee",
        blog: "https://blog.younghee.com"
      },
      {
        user_id: "user_003",
        workspace_id: workspaceIdNum,
        nickname: "박지민",
        email: "jimin.park@example.com",
        image: "https://data1.pokemonkorea.co.kr/newdata/pokedex/full/000701.png",
        role_name: "member",
        group_name: ["마케팅팀", "기획팀"],
        group_id: [4, 2],
        github: null,
        blog: null
      },
      {
        user_id: "user_004",
        workspace_id: workspaceIdNum,
        nickname: "최수진",
        email: "sujin.choi@example.com",
        image: "https://data1.pokemonkorea.co.kr/newdata/pokedex/full/000601.png",
        role_name: "member",
        group_name: ["개발팀"],
        group_id: [1],
        github: "sujin-dev",
        blog: "https://tech.sujin.com"
      },
      {
        user_id: "user_005",
        workspace_id: workspaceIdNum,
        nickname: "정민준",
        email: "minjun.jung@example.com",
        image: "https://data1.pokemonkorea.co.kr/newdata/pokedex/full/000401.png",
        role_name: "member",
        group_name: ["인사팀"],
      group_id: [5],
        github: null,
        blog: "https://blog.minjun.com"
      },
  ];
  
  return dummyUsers;
}

/* 워크스페이스 유저 추가 */
export async function addUser(workspaceId: string, payload: Partial<Profile>): Promise<boolean> {  

  const res = await fetchWithAuth(`${BASE}/api/workspaces/${workspaceId}/users/single`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res && res.ok) {
      return true;
  }
  return false;
}

/* 워크스페이스 유저 역할 수정 */
export async function updateUserRole(workspaceId: string, userId: string, role_id: string): Promise<boolean> { 

  const res = await fetchWithAuth(`${BASE}/api/workspaces/${workspaceId}/users/${userId}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    body: JSON.stringify({role_id: role_id}),
  });

  if (res && res.ok) {
      return true;
  }
  return false;
} 

/* 워크스페이스 유저 삭제 */
export async function deleteUser(workspaceId: string, userId: string): Promise<boolean> {  

  const res = await fetchWithAuth(`${BASE}/api/workspaces/${workspaceId}/users/${userId}/delete`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },    
  });

  if (res && res.ok) {
      return true;
  }
  return false;
}

