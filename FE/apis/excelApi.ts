import { fetchWithAuth } from "./authApi";

const BASE = process.env.NEXT_PUBLIC_BASE;

// FE/apis/excelApi.ts
export async function getWorkspaceColumns() {
  const res = await fetchWithAuth(`${BASE}/api/workspaces/1/users`, {
    method: "GET",
  });

  if (res == null) {
  } else {
    if (!res.ok) throw new Error("워크스페이스 컬럼 조회 실패");
    return res.json();
  }
}

// users 테이블에 user 생성
export async function createUsers(users: any[]) {
  // 예시: 여러 명을 한 번에 생성하는 API가 있다면
  const res = await fetch(`${BASE}/api/workspaces/${workspaceId}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ users }),
  });
  if (!res.ok) throw new Error("유저 생성 실패");
  return res.json();
}
