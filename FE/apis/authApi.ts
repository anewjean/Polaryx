export interface RefreshResponse {
  access_token: string;
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
    const res = await fetch("http://localhost:8000/api/auth/refresh", {
      method: "POST",
      credentials: "include", // httpOnly 쿠키에 담긴 refresh_token 자동 전송
    });

    if (!res.ok) {

      
      if (res.status === 401) {
        const errbody: { detail: string } = await res.clone().json();
        console.log(errbody.detail);
        await reissueAccessToken(errbody.detail);
      }
      else {
        return;
      }
    }


    else {
      const { access_token: newToken } = (await res.json()) as RefreshResponse;
      console.log(newToken);
      localStorage.setItem("access_token", newToken);
    }
    return;
  } else if (details == "INVALID ACCESS TOKEN") {
    console.log("INVALID ACCESS TOKEN")
    return null;
  } else {
    // refresh token이 비정상일 때
    console.log("NOT INVALID REFRESH TOKEN")
    return null;
  }
}
