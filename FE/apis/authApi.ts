const BASE = process.env.NEXT_PUBLIC_BASE!;

export interface RefreshResponse {
  access_token: string;
}

// fetchWithAuth 으로 다시 만들기.
export async function fetchWithAuth(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response | null> {
  console.log("******** in FetchWithAuth ********");
  console.log(input);
  console.log(init["method"]);
  let accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
    console.warn("No access token available.");
    return null;
  }

  // Authorization 헤더 추가
  const authHeaders = {
    ...init.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  console.log("authHeaders : "+{authHeaders})

  init = {
    ...init,
    headers: authHeaders,
    credentials: "include",
  };

  // 1차 요청
  let res = await fetch(input, init);

  // 만약 토큰 만료 등으로 실패하면
  if (res.status === 401) {
    try {
      const errBody = await res.clone().json();
      const detail = errBody?.detail;

      if (detail === "EXPIRED TOKEN") {
        const newAccessToken = await reissueAccessToken("EXPIRED TOKEN");

        if (!newAccessToken) {
          window.location.href = "/";
          return null;
        }

        console.log("**** Acess Token 받기 성공 ***");

        // Authorization 다시 업데이트
        const retryHeaders = {
          ...init.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        const retryInit: RequestInit = {
          ...init,
          headers: retryHeaders,
          credentials: "include",
        };

        // 재요청
        res = await fetch(input, retryInit);
      } else if (detail === "INVALID ACCESS TOKEN" || detail === "NOT INVALID REFRESH TOKEN") {
        console.warn("유효하지 않은 토큰");
        window.location.href = "/";
        return null;
      }
    } catch (e) {
      console.error("fetchWithAuth json parse 실패", e);
      window.location.href = "/";
      return null;
    }
  }

  return res;
}




// refresh_token 쿠키를 자동으로 보내서, 기존 엑세스 토큰 삭제하고,
// 새 access_token을 발급받고 local storage에 저장한 뒤 반환
export async function reissueAccessToken(details: string): Promise<any> {
  
  console.log("access_token 삭제");
  localStorage.removeItem("access_token");
  
  const test = localStorage.getItem("access_token");
  console.log(test)
  
  if (details == "EXPIRED TOKEN") {
    console.log("in reissueAccessToken, EXPIRED TOKEN");
    const res = await fetch(`http://${BASE}/api/auth/refresh`, {
      method: "POST",
      credentials: "include", // httpOnly 쿠키에 담긴 refresh_token 자동 전송
    });

    if (!res.ok) {
        console.log("ACCESS TOKEN 재발급 실패")
    }
    else {
      const { access_token: newToken } = (await res.json()) as RefreshResponse;
      console.log(newToken);
      localStorage.setItem("access_token", newToken);
      return newToken;
    }
  }
  else if (details == "INVALID ACCESS TOKEN") {
    console.log("INVALID ACCESS TOKEN")
  }
  else {
    // refresh token이 비정상일 때
    console.log("NOT INVALID REFRESH TOKEN")
  }

  return null;
}
