import { fetchWithAuth } from "./authApi";

const BASE = process.env.NEXT_PUBLIC_BASE;

export interface Profile {
  user_id: string;
  workspace_id: number | null;
  nickname: string;
  email: string;
  // phone?: string | null;
  image?: string | null;
  role: string | null;
  groups: string[] | null;
  github?: string | null;
  blog?: string | null;
}

const dummyProfile: Profile = {
  user_id: "none",
  workspace_id: -1,
  nickname: "none",
  email: "none",
  // phone?: string | null;
  image: null,
  role: "none",
  groups: [],
  github: "none",
  blog: "none"
}

/* 프로필 조회 */
export async function getProfile(workspaceId: string, targetId: string): Promise<Profile> {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const res = await fetchWithAuth(`${BASE}/api/workspaces/${workspaceId}/members/${targetId}/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });
  if (res == null)
  {
    console.log("NOT REACH - getProfile");
    return dummyProfile;
  }
  else{
    // if (res.status === 401) throw new Error("세션이 만료되었습니다.");
    if (!res.ok) throw new Error("프로필 조회에 실패했습니다.");
    return res.json();
  }
}

/* 프로필 부분 수정 (PATCH) */
export async function patchProfile(workspaceId: string, userId: string, payload: Partial<Profile>): Promise<Profile> {
  console.log("API 테스트");
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const res = await fetchWithAuth(`${BASE}/api/workspaces/${workspaceId}/members/${userId}/profile`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (res == null)
  {
    console.log("NOT REACH - patchProfile");
    return dummyProfile;
  }
  else {
    // if (res.status === 401) throw new Error("세션이 만료되었습니다.");
    if (!res.ok) throw new Error("프로필 수정에 실패했습니다.");
    return res.json();
  }
}
