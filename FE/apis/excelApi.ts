// FE/apis/excelApi.ts

// users 테이블에 user 생성
export async function createUsers(users: any[]) {
  // 예시: 여러 명을 한 번에 생성하는 API가 있다면
  const res = await fetch("http://localhost:8000/api/workspaces/1/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ users }),
  });
  if (!res.ok) throw new Error("유저 생성 실패");
  return res.json();
}

export async function getWorkspaceColumns() {
  const res = await fetch("http://localhost:8000/api/workspaces/1/users", {
    method: "GET",
  });
  if (!res.ok) throw new Error("워크스페이스 컬럼 조회 실패");
  return res.json();
}

// {
//     "users": [
//       { "name": "홍길동", "email": "hong@test.com", "workspace_id": 1 },
//       { "name": "김철수", "email": "kim@test.com", "workspace_id": 1 }
//     ]
//   }

// workspace_members 테이블에 member 생성
// export async function createWorkspaceMembers(members: any[]) {
//   // 예시: 여러 명을 한 번에 생성하는 API가 있다면
//   const res = await fetch("http://localhost:8000/workspace-members/create", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ members }),
//   });
//   if (!res.ok) throw new Error("멤버 생성 실패");
//   return res.json();
// }
