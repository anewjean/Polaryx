import { fetchWithAuth } from "./authApi";

const BASE = process.env.NEXT_PUBLIC_BASE;

export interface workspace {
  workspace_id: number;
  workspace_name: string;
}

const dummyWorkspace:workspace = {
  workspace_id: -1,
  workspace_name: "none"
} 

/* 워크스페이스 정보 조회 */
export async function getWorkspaceName(workspaceId: string): Promise<workspace> {
  try {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) throw new Error("로그인이 필요합니다.");

    const res = await fetchWithAuth(`http://${BASE}/api/workspaces/${workspaceId}/title`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (res == null)
    {
      console.log("NOT REACH : getWorkspaceName")
      return dummyWorkspace; 
    }
    else {

      if (!res.ok) {
        console.error(`워크스페이스 조회 실패: ${res.status}`);
        // 기본값 반환 (API 호출 실패)
        return { workspace_id: Number(workspaceId), workspace_name: "API 호출 실패" };
      }
      return res.json();
    } 
  }
  catch (error) {
    console.error("워크스페이스 정보 조회 중 오류:", error);
    // 에러 발생 시 기본값 반환 (개발용)
    return { workspace_id: 0, workspace_name: "에러 발생" };

  }
}
