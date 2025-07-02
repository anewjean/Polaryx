export interface RefreshResponse {
  access_token: string;
}

// refresh_token 쿠키를 자동으로 보내서,
// 새 access_token을 발급받고 local storage에 저장한 뒤 반환
export async function reissueAccessToken(): Promise<string> {
  const res = await fetch("http://localhost:8000/auth/refresh", {
    method: "POST",
    credentials: "include", // httpOnly 쿠키에 담긴 refresh_token 자동 전송
  });

  if (!res.ok) {  // 에러
    throw new Error("access token 재발급 실패");
  }

  const { access_token: newToken } = (await res.json()) as RefreshResponse;
  localStorage.setItem("accessToken", newToken);
  return newToken;
}