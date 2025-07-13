import { fetchWithAuth } from "./authApi";
const BASE = process.env.NEXT_PUBLIC_BASE;
export async function resetDB() {
  const res = await fetchWithAuth(`${BASE}/api/reset`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  if (res?.ok) alert("DB 초기화 성공");
  else alert("DB 초기화 실패");
}
