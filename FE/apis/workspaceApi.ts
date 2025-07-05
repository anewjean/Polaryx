const BASE = "http://127.0.0.1:8000";

import { usePathname } from "next/navigation";

export interface workspace {
    id: number;
    name: string;    
}

/* 워크스페이스 정보 조회 */
export async function getWorkspaceName(): Promise<workspace> {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) throw new Error("로그인이 필요합니다.");

    const pathname = usePathname();
    const workspaceId = pathname.split("/")[1];    

    const res = await fetch(`${BASE}/api/${workspaceId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            Accept: "application/json",
        },
    });
    if (!res.ok) throw new Error("워크스페이스 조회 실패");
    return res.json();
}


