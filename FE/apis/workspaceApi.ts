import { fetchWithAuth } from "./authApi";

const BASE = process.env.NEXT_PUBLIC_BASE;

export interface workspace {
  workspace_id: number;
  workspace_name: string;
}

const dummyWorkspace: workspace = {
  workspace_id: -1,
  workspace_name: "none",
};

/* 워크스페이스 정보 조회 */
export async function getWorkspaceName(
  workspaceId: string,
): Promise<workspace> {
  const res = await fetchWithAuth(
    `${BASE}/api/workspaces/${workspaceId}/title`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (res == null) {
    console.log("NOT REACH : getWorkspaceName");
    return dummyWorkspace;
  } else {
    if (!res.ok) {
      console.error(`워크스페이스 조회 실패: ${res.status}`);
      // 기본값 반환 (API 호출 실패)
      return {
        workspace_id: Number(workspaceId),
        workspace_name: "API 호출 실패",
      };
    }
    return res.json();
  }
}
