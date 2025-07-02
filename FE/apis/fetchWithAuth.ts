import { reissueAccessToken } from "./authApi";

export default async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
  // 1) 기존 토큰 헤더에 붙이기
  const token = localStorage.getItem("accessToken");
  init.headers = {
    ...(init.headers || {}),
    Authorization: token ? `Bearer ${token}` : "",
  };
  init.credentials = "include"; // 쿠키(=refresh_token) 전송

  // 2) 1차 요청
  let res = await fetch(input, init); // HTTP 응답이 담겨있음

  // 3) 200번대가 아니면
  if (!res.ok) {
    // 에러 바디 파싱 (detail 확인용)
    let errorDetail: string | undefined;

    try {
      const errBody = await res.clone().json();
      errorDetail = errBody.details;
    } catch {}

    // refresh token이 없는 상태가 아니라면,
    if (res.status === 401 && errorDetail !== "NO REFRESH TOKEN IN COOKIES") {
      const newToken = await reissueAccessToken();
      init.headers = {
        ...(init.headers || {}),
        Authorization: `Bearer ${newToken}`,
      };
      res = await fetch(input, init);
    }
  }

  return res;
}
