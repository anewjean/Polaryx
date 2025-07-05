const BASE = "http://127.0.0.1:8000";

import { usePathname } from "next/navigation";

export interface Tab {
  tabId: string;
  tabName: string;
  sectionId: string;
  sectionName?: string;
  subSectionId?: string | null;
  subSectionName?: string | null;
  tabMembersCount?: number | null;
  members: Member[] | null;
}

export interface Member {
  userId: string;
  nickname: string;
  image?: string | null;
  role: string;
  groups?: string[] | [];
}

/* 탭 이름 중복 확인 */
export async function checkTabName(tabName: string): Promise<boolean> {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const pathname = usePathname();
  const [, , workspaceId, , tabId] = pathname.split("/");

  const res = await fetch(`${BASE}/api/workspaces/${workspaceId}/tabs?name=${tabName}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) throw new Error("탭 이름 중복 확인 실패");
  return res.json();
}

/* 탭 정보(이름, 인원 수) 조회 */
export async function getTabInfo(): Promise<Tab> {
  try {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) throw new Error("로그인이 필요합니다.");

    const pathname = usePathname();
    // URL 파라미터 추출 - 정규식 사용
    const workspaceIdMatch = pathname.match(/\/workspaces\/([^\/]+)/);
    const workspaceId = workspaceIdMatch ? workspaceIdMatch[1] : null;

    const tabIdMatch = pathname.match(/\/tabs\/([^\/]+)/);
    const tabId = tabIdMatch ? tabIdMatch[1] : null;

    const res = await fetch(`${BASE}/api/workspaces/${workspaceId}/tabs/${tabId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.error(`탭 정보 조회 실패: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    // 에러 발생 시 기본값 반환 (테스트)
    console.error("탭 정보 조회 중 오류:", error);
    return {
      tabId: "0",
      tabName: "API 호출 실패",
      sectionId: "0",
      subSectionId: null,
      subSectionName: null,
      tabMembersCount: null,
      members: null,
    };
  }
}

/* 탭 리스트 조회 */
export async function getTabList(): Promise<Tab[]> {
  try {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) throw new Error("로그인이 필요합니다.");

    const pathname = usePathname();
    // URL 파라미터 추출 방식 개선 - 정규식 사용
    const workspaceIdMatch = pathname.match(/\/workspaces\/([^\/]+)/);
    const workspaceId = workspaceIdMatch ? workspaceIdMatch[1] : null;

    if (!workspaceId) {
      console.warn("워크스페이스 ID를 찾을 수 없어 기본값을 사용합니다.");
    }

    const res = await fetch(`${BASE}/api/workspaces/${workspaceId}/tabs`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.error(`탭 리스트 조회 실패: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("탭 리스트 조회 중 오류:", error);
    // 에러 발생 시 기본값 반환 (테스트)
    return [
      {
        tabId: "1",
        tabName: "API 호출 실패",
        sectionId: "0",
        subSectionId: null,
        subSectionName: null,
        tabMembersCount: null,
        members: null,
      },
      {
        tabId: "2",
        tabName: "API 호출 실패",
        sectionId: "1",
        subSectionId: null,
        subSectionName: null,
        tabMembersCount: null,
        members: null,
      },
      {
        tabId: "3",
        tabName: "API 호출 실패",
        sectionId: "2",
        subSectionId: null,
        subSectionName: null,
        tabMembersCount: null,
        members: null,
      },
      {
        tabId: "4",
        tabName: "API 호출 실패",
        sectionId: "3",
        subSectionId: null,
        subSectionName: null,
        tabMembersCount: null,
        members: null,
      },
    ];
  }
}

/* 탭 추가 (섹션 타입, 탭 이름, 참여자 id 필요) */
export async function createTab(sectionId: string, tabName: string): Promise<Tab> {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const pathname = usePathname();
  const [, , workspaceId] = pathname.split("/");

  const res = await fetch(`${BASE}/api/workspaces/${workspaceId}/tabs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ sectionId, tabName }),
  });
  if (!res.ok) throw new Error("탭 추가 실패");
  return res.json();
}

/* 탭 참여 인원 조회 */
export async function getMemberList(): Promise<Member[]> {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const pathname = usePathname();
  const [, , workspaceId, , tabId] = pathname.split("/");

  const res = await fetch(`${BASE}/api/workspaces/${workspaceId}/tabs/${tabId}/members`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) throw new Error("탭 참여 인원 조회 실패");
  return res.json();
}

/* 탭 참여 가능 인원 조회 */
export async function getPossibleMemberList(): Promise<Member[]> {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const pathname = usePathname();
  const [, , workspaceId, , tabId] = pathname.split("/");

  const res = await fetch(`${BASE}/api/workspaces/${workspaceId}/tabs/${tabId}/non-members`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) throw new Error("탭 참여 가능 인원 조회 실패");
  return res.json();
}

/* 탭 인원 초대 */
export async function postMemberList(userIds: string[]): Promise<Member[]> {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const pathname = usePathname();
  const [, , workspaceId, , tabId] = pathname.split("/");

  const res = await fetch(`${BASE}/api/workspaces/${workspaceId}/tabs/${tabId}/members`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ userIds }),
  });
  if (!res.ok) throw new Error("탭 참여 인원 추가 실패");
  return res.json();
}
