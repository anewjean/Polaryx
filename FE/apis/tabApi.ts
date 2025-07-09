import { fetchWithAuth } from "./authApi";


const BASE = process.env.NEXT_PUBLIC_BASE;

export interface Tab {
  tab_id: number;
  tab_name: string;
  section_id?: number;
  section_name?: string;
  subsection_id?: number | null;
  subsection_name?: string | null;
  members_count?: number | null;
  members?: Member[] | null;
}

const dummyTab: Tab = {
  tab_id: -1,
  tab_name: "none",
  section_id: -1,
  section_name: "none",
  subsection_id: null,
  subsection_name: null,
  members_count: null,
  members: null
};

export interface Member {
  user_id: string;
  nickname: string;
  image?: string | null;
  role: string;
  groups?: string[] | [];
}

/* 탭 이름 중복 확인 */
export async function checkTabName(workspaceId: string, sectionId: string, tabName: string): Promise<boolean> {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const res = await fetchWithAuth(`http://${BASE}/api/workspaces/${workspaceId}/sections/${sectionId}/tabs?name=${tabName}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });
  if (res == null)
  {
    console.log("NOT REACH - checkTabName");
    return false;
  }
  else{
    if (!res.ok) throw new Error("탭 이름 중복 확인 실패");
    return res.json();
  }
}

/* 탭 정보(이름, 인원 수) 조회 */
export async function getTabInfo(workspaceId: string, tabId: string): Promise<Tab> {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const res = await fetchWithAuth(`http://${BASE}/api/workspaces/${workspaceId}/tabs/${tabId}/info`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });



  if (res == null){
    console.log("NOT REACH - getTabInfo");
    return dummyTab;
  }
  else{
    if (!res.ok) {
      console.error(`탭 정보 조회 실패: ${res.status}`);
    }
    return res.json();
  }
}

/* 탭 리스트 조회 */
export async function getTabList(workspaceId: string): Promise<Tab[]> {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const res = await fetchWithAuth(`http://${BASE}/api/workspaces/${workspaceId}/tabs`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (res == null){
    return [];
  }
  else{

    if (!res.ok) {
      console.error(`탭 리스트 조회 실패: ${res.status}`);
    }
  
    return res.json();
  }
}

/* 탭 추가 (섹션 타입, 탭 이름, 참여자 id 필요) */
export async function createTab(workspaceId: string, sectionId: string, tabName: string): Promise<Tab> {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const res = await fetchWithAuth(`http://${BASE}/api/workspaces/${workspaceId}/tabs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ workspace_id: workspaceId, section_id: sectionId, tab_name: tabName, subsection_id: null }),
  });

  if (res == null){
    console.log("NOT REACH - createTab");
    return dummyTab;
  }

  else{
    if (!res.ok) throw new Error("탭 추가 실패");
    return res.json();
  }
}

/* 탭 참여 인원 조회 */
export async function getMemberList(workspaceId: string, tabId: string): Promise<Member[]> {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const res = await fetchWithAuth(`http://${BASE}/api/workspaces/${workspaceId}/tabs/${tabId}/members`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });
  if (res == null)
  {
    console.log("NOT REACH - getMemberList");
    return [];
  
  }
  else{

    if (!res.ok) throw new Error("탭 참여 인원 조회 실패");
    return res.json();
  }
}

/* 탭 참여 가능 인원 조회 */
export async function getPossibleMemberList(workspaceId: string, tabId: string): Promise<Member[]> {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const res = await fetchWithAuth(`http://${BASE}/api/workspaces/${workspaceId}/tabs/${tabId}/non-members`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });
  if (res == null)
  {
    console.log("NOT REACH - getPossibleMemberList");
    return [];
  }
  else{

    if (!res.ok) throw new Error("탭 참여 가능 인원 조회 실패");
    return res.json();
  }
}

/* 탭 인원 초대 */
export async function postMemberList(workspaceId: string, tabId: string, userIds: string[]): Promise<Member[]> {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) throw new Error("로그인이 필요합니다.");

  const res = await fetchWithAuth(`http://${BASE}/api/workspaces/${workspaceId}/tabs/${tabId}/members`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ user_ids: userIds }),
  });
  if (res == null){
    console.log("NOT REACH - postMemberList");
    return [];
  }else{

    if (!res.ok) throw new Error("탭 참여 인원 추가 실패");
    return res.json();
  }
}
