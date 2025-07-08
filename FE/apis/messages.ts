const BASE = process.env.NEXT_PUBLIC_BASE

const request = async <T = any>(path: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "서버 에러");
  }

  // No Content (204) 이면 JSON 파싱대신 null 반환 (DELETE 요청 등)
  if (response.status === 204) {
    return null as any;
  }
  return response.json();
};

export const updateMessage = async (id: number, message: string) => {
  return request(`/messages/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ content: message }),
  });
};

export const deleteMessage = async (workspaceId: string, tabId: string, messageId: number): Promise<null> => {
  return request(`http://${BASE}/api/workspaces/${workspaceId}/tabs/${tabId}/messages/${messageId}`, {
    method: "POST",
  });
};

// export const getMessages = async (workspaceId: string, tabId: string) => {
//   return request(`http://localhost:8000/api/workspaces/${workspaceId}/tabs/${tabId}/messages`, {
//     method: "GET",
//   });
// };

export const getMessages = async (workspaceId: string, tabId: string, beforeId?: number) => {
  
  const url = new URL(`http://${BASE}/api/workspaces/${workspaceId}/tabs/${tabId}/messages`);

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
