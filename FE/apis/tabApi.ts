const BASE = "http://127.0.0.1:8000";

import { usePathname } from "next/navigation";

export interface Tab {
  id: string;
  sectionId: string;
  subSectionId: string;
  name: string;
  tabMembersCount?: number | null;
  tabMembers?: Member[] | null;
}

export interface Member {
  userId: string;
  nickname: string;
  image?: string | null;
  role: string;
  groups?: string | null;
}

/* 탭 이름 중복 확인 */
export async function checkTabName(tabName: string): Promise<boolean> {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const pathname = usePathname();
  const workspaceId = pathname.split("/")[1];

  const res = await fetch(`${BASE}/api/${workspaceId}/tab/check_name`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ tabName }),
  });
  if (!res.ok) throw new Error("탭 이름 중복 확인 실패");
  return res.json();
}

/* 탭 정보(이름, 인원 수) 조회 */
export async function getTabInfo(): Promise<Tab> {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const pathname = usePathname();
  const workspaceId = pathname.split("/")[1];
  const tabId = pathname.split("/")[2];

  const res = await fetch(`${BASE}/api/${workspaceId}/${tabId}/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) throw new Error("탭 정보 조회 실패");
  return res.json();
}

/* 탭 리스트 조회 */
export async function getTabList(): Promise<Tab[]> {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const pathname = usePathname();
  const workspaceId = pathname.split("/")[1];

  const res = await fetch(`${BASE}/api/${workspaceId}/tab`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) throw new Error("탭 리스트 조회 실패");
  return res.json();
}

/* 탭 추가 (섹션 타입, 탭 이름, 참여자 id 필요) */
export async function postTab(sectionId: number, tabName: string, userIds: string[]): Promise<Tab> {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const pathname = usePathname();
  const workspaceId = pathname.split("/")[1];

  const res = await fetch(`${BASE}/api/${workspaceId}/tabs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ sectionId, tabName, userIds }),
  });
  if (!res.ok) throw new Error("탭 추가 실패");
  return res.json();
}

/* 탭 참여 인원 조회 */
export async function getMemberList(): Promise<Member[]> {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const pathname = usePathname();
  const workspaceId = pathname.split("/")[1];
  const tabId = pathname.split("/")[2];

  const res = await fetch(`${BASE}/api/${workspaceId}/${tabId}/members`, {
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
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const pathname = usePathname();
  const workspaceId = pathname.split("/")[1];
  const tabId = pathname.split("/")[2];

  const res = await fetch(`${BASE}/api/${workspaceId}/${tabId}/possible_members`, {
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
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const pathname = usePathname();
  const workspaceId = pathname.split("/")[1];
  const tabId = pathname.split("/")[2];

  const res = await fetch(`${BASE}/api/${workspaceId}/${tabId}/members`, {
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
