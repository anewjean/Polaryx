const BASE = process.env.NEXT_PUBLIC_BASE;

import { fetchWithAuth } from "./authApi";

const request = async (path: string, options: RequestInit = {}): Promise<any> => {
  const response = await fetchWithAuth(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (response == null)
  {
    console.log("NOT REACH")
    return;
  }
  else{
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "서버 에러");
    }
  
    // No Content (204) 이면 JSON 파싱대신 null 반환 (DELETE 요청 등)
    if (response.status === 204) {
      return null as any;
    }
    return response.json();
  }
};

export const updateMessage = async (id: number, message: string) => {
  return request(`/messages/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ content: message }),
  });
};

export const deleteMessage = async (workspaceId: string, tabId: string, messageId: number): Promise<null> => {
  return request(`${BASE}/api/workspaces/${workspaceId}/tabs/${tabId}/messages/${messageId}`, {
    method: "DELETE",
  });
};

// export const getMessages = async (workspaceId: string, tabId: string) => {
//   return request(`http://localhost:8000/api/workspaces/${workspaceId}/tabs/${tabId}/messages`, {
//     method: "GET",
//   });
// };

export const getMessages = async (workspaceId: string, tabId: string, beforeId?: number) => {
  const url = new URL(`${BASE}/api/workspaces/${workspaceId}/tabs/${tabId}/messages`);

  console.log("************ get Messages ***********");
  // beforeId가 있을 경우 쿼리로 추가
  if (beforeId !== undefined) {
    url.searchParams.append("before_id", beforeId.toString());
  }

  return request(url.toString(), {
    method: "GET",
    credentials: "include", // 필요 시 쿠키 전송
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const systemMessage = async (workspaceId: string, tabId: string, timestamp: string, message: string) => {
  return request(`/messages/${workspaceId}/${tabId}`, {
    method: "POST",
    body: JSON.stringify({ timestamp, message }),
  });
};

// DM 메시지 보내기
export async function sendDirectMessage(workspaceId: string, userIds: string[]): Promise<{ tab_id: number }> {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const res = await fetchWithAuth(`${BASE}/api/workspaces/${workspaceId}/dms`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ user_ids: userIds }),
  });
  if (res == null)
  {
    console.log("NOT REACH : sendDirectMessage")
    return { tab_id: -1 };
  }
  else
  {
    if (!res.ok) throw new Error("DM 생성 실패");
    return res.json();
  }
}
