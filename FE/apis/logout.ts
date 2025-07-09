import { fetchWithAuth } from "./authApi";

const BASE = process.env.NEXT_PUBLIC_BASE

export async function logout() {
  const access_token = localStorage.getItem("access_token");
  // access_token이 없으면 에러 반환
  if (!access_token) {
    throw new Error("NO ACCESS TOKEN");
  }

  // api 호출
  const res = await fetchWithAuth(`http://${BASE}/api/auth/logout`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${access_token}`, // access_token 담아서 보내기
    },
  });
  if (res == null)
  {
    console.log("NOT REACH : logout");
    return;
  }
  else
  {
    // 에러 처리
    if (!res.ok) {
      throw new Error(`Logout failed: ${res.status}`);
    }
    return res;
  }
}
