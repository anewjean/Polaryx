export interface RefreshResponse {
  access_token: string;
}

// refresh_token 쿠키를 자동으로 보내서,
// 새 access_token을 발급받고 local storage에 저장한 뒤 반환
export async function reissueAccessToken(details: string): Promise<any> {
  console.log(2);

  if (details == "EXPIRED TOKEN") {
    console.log(3);
    const res = await fetch("http://localhost:8000/auth/refresh", {
      method: "POST",
      credentials: "include", // httpOnly 쿠키에 담긴 refresh_token 자동 전송
    });
    const { access_token: newToken } = (await res.json()) as RefreshResponse;
    console.log(newToken);
    localStorage.setItem("accessToken", newToken);
    return;
  } else if (details == "INVALID ACCESS TOKEN") {
    window.location.replace("/");
    return null;
  } else {
    // refresh token이 비정상일 때
  }
}
