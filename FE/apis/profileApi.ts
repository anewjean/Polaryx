const BASE = "http://127.0.0.1:8000";

export interface Profile {
  id: string;
  userId: string;
  workspaceId: number;
  nickname: string;
  email: string;
  phone?: string | null;
  image?: string;
  role: string;
  groups?: string[];
  github?: string;
  blog?: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

/* Payload 전달 시 생략할 필드 */
type EditableProfile = Omit<
  Profile,
  "id" | "userId" | "email" | "workspaceId" | "role" | "groups" | "createdAt" | "updatedAt" | "deletedAt"
>;

// /* 프로필 조회 */
// export async function getProfile(targetId: string): Promise<Profile> {
//   // const accessToken = localStorage.getItem("accessToken");
//   // if (!accessToken) throw new Error("로그인이 필요합니다.");

//   const res = await fetch(`${BASE}/api/profile/${targetId}`, {
//     method: "GET",
//     headers: {
//       // "Authorization": `Bearer ${accessToken}`,
//       Accept: "application/json",
//     },
//   });
//   if (res.status === 401) {
//     throw new Error("세션이 만료되었습니다.");
//   }
//   if (!res.ok) throw new Error("프로필 조회에 실패했습니다.");
//   return res.json();
// }

// /* 프로필 부분 수정 (PATCH) */
// export async function patchProfile(targetId: string, payload: Partial<EditableProfile>): Promise<Profile> {
//   // const accessToken = localStorage.getItem("accessToken");
//   // if (!accessToken) throw new Error("로그인이 필요합니다.");

//   const res = await fetch(`${BASE}/api/profile/${targetId}`, {
//     method: "PATCH",
//     headers: {
//       // "Authorization": `Bearer ${accessToken}`,
//       "Content-Type": "application/json",
//       Accept: "application/json",
//     },
//     body: JSON.stringify(payload),
//   });
//   if (res.status === 401) {
//     throw new Error("세션이 만료되었습니다.");
//   }
//   if (!res.ok) throw new Error("프로필 수정에 실패했습니다.");
//   return res.json();
// }

export async function getProfile(targetId: string): Promise<Profile> {
  const res = await fetch(`${BASE}/workspace_members/${targetId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  if (!res.ok) throw new Error("프로필 조회에 실패했습니다.");
  return res.json();
}

export async function getMyProfile(): Promise<Profile> {
  const res = await fetch(`${BASE}/workspace_members/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  if (!res.ok) throw new Error("프로필 조회에 실패했습니다.");
  return res.json();
}

export async function patchMyProfile(payload: Partial<EditableProfile>): Promise<Profile> {
  const res = await fetch(`${BASE}/workspace_members/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("프로필 수정에 실패했습니다.");
  return res.json();
}
