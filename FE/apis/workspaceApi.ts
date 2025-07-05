const BASE = "http://127.0.0.1:8000";

import { usePathname } from "next/navigation";

export interface workspace {
  id: number;
  name: string;
}

/* 워크스페이스 정보 조회 */
export async function getWorkspaceName(): Promise<workspace> {
  try {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) throw new Error("로그인이 필요합니다.");

    const pathname = usePathname();
    // URL 파라미터 추출 - 정규식 사용
    const workspaceIdMatch = pathname.match(/\/workspaces\/([^\/]+)/);
    const workspaceId = workspaceIdMatch ? workspaceIdMatch[1] : null;

    const res = await fetch(`${BASE}/api/workspaces/${workspaceId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.error(`워크스페이스 조회 실패: ${res.status}`);
      // 기본값 반환 (API 호출 실패)
      return { id: Number(workspaceId), name: "API 호출 실패" };
    }
    return res.json();
  } catch (error) {
    console.error("워크스페이스 정보 조회 중 오류:", error);
    // 에러 발생 시 기본값 반환 (개발용)
    return { id: 0, name: "에러 발생" };
  }
}
