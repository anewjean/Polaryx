const BASE = "http://127.0.0.1:8000";

<<<<<<< HEAD
export interface Profile {  
=======
export interface Profile {
  id: string;
>>>>>>> main
  userId: string;
  workspaceId: number;
  nickname: string;
  email: string;
<<<<<<< HEAD
  phone?: string;
  image?: string;
  role: string;
  groups?: string[];
  github?: string;
  blog?: string;
=======
  // phone?: string | null;
  image?: string | null;
  role: string;
  groups?: string[] | null;
  github?: string | null;
  blog?: string | null;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
>>>>>>> main
}

/* 프로필 조회 */
export async function getProfile(targetId: string): Promise<Profile> {
<<<<<<< HEAD
  const accessToken = localStorage.getItem("accessToken");
=======
  const accessToken = localStorage.getItem("access_token");
>>>>>>> main
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const res = await fetch(`${BASE}/workspace_members/${targetId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });
<<<<<<< HEAD
  if (res.status === 401) {
    throw new Error("세션이 만료되었습니다.");
  }
=======
  if (res.status === 401) throw new Error("세션이 만료되었습니다.");
>>>>>>> main
  if (!res.ok) throw new Error("프로필 조회에 실패했습니다.");
  return res.json();
}

/* 프로필 부분 수정 (PATCH) */
export async function patchProfile(userId: string, payload: Partial<Profile>): Promise<Profile> {
<<<<<<< HEAD
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const res = await fetch(`${BASE}/workspace_members/me`, {
=======
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const res = await fetch(`${BASE}/workspace_members/${userId}`, {
>>>>>>> main
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
<<<<<<< HEAD
  if (res.status === 401) {
    throw new Error("세션이 만료되었습니다.");
  }
=======
  if (res.status === 401) throw new Error("세션이 만료되었습니다.");
>>>>>>> main
  if (!res.ok) throw new Error("프로필 수정에 실패했습니다.");
  return res.json();
}
