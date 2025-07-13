import { fetchWithAuth } from "./authApi";

const BASE = process.env.NEXT_PUBLIC_BASE;

export async function resetDB() {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const res = await fetchWithAuth(`${BASE}/api/reset`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (res?.ok) alert("DB 초기화 성공");
  else alert("DB 초기화 실패");
}
