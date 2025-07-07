const request = async <T = any>(path: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "서버 에러");
  }

  return response.json();
};

export const updateMessage = async (id: number, message: string) => {
  return request(`/messages/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ content: message }),
  });
};

export const deleteMessage = async (workspaceId: string, tabId: string, messageId: number) => {
  return request(`http://localhost:8000/workspaces/${workspaceId}/tabs/${tabId}/messages/${messageId}`, {
    method: "POST",
  });
};

export const getMessages = async (workspaceId: string, tabId: string) => {
  return request(`http://localhost:8000/workspaces/${workspaceId}/tabs/${tabId}/messages`, {
    method: "GET",
  });
};

export const systemMessage = async (workspaceId: string, tabId: string, timestamp: string, message: string) => {
  return request(`/messages/${workspaceId}/${tabId}`, {
    method: "POST",
    body: JSON.stringify({ timestamp, message }),
  });
};
