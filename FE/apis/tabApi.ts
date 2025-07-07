const BASE = "http://127.0.0.1:8000";

export interface Tab {
  tab_id: string;
  tab_name: string;
  section_id: string;
  section_name?: string;
  subsection_id?: string | null;
  subsection_name?: string | null;
  members_count?: number | null;
  members: Member[] | null;
}

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
export async function getTabInfo(workspaceId: string, tabId: string): Promise<Tab> {
  try {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) throw new Error("로그인이 필요합니다.");

    const res = await fetch(`${BASE}/api/workspaces/${workspaceId}/tabs/${tabId}/info`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.error(`탭 정보 조회 실패: ${res.status}`);
      return {
        tab_id: "0",
        tab_name: "API 호출 실패",
        section_id: "0",
        subsection_id: null,
        subsection_name: null,
        members_count: 25,
        members: null,
      };
    }

    return res.json();
  } catch (error) {
    // 에러 발생 시 기본값 반환 (테스트)
    console.error("탭 정보 조회 중 오류:", error);
    return {
      tab_id: "0",
      tab_name: "API 호출 실패",
      section_id: "0",
      subsection_id: null,
      subsection_name: null,
      members_count: 25,
      members: null,
    };
  }
}

/* 탭 리스트 조회 */
export async function getTabList(workspaceId: string): Promise<Tab[]> {
  try {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) throw new Error("로그인이 필요합니다.");

    const res = await fetch(`${BASE}/api/workspaces/${workspaceId}/tabs`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.error(`탭 리스트 조회 실패: ${res.status}`);
      return [
        {
          tab_id: "1",
          tab_name: "API 호출 실패",
          section_id: "0",
          subsection_id: null,
          subsection_name: null,
          members_count: null,
          members: null,
        },
        {
          tab_id: "2",
          tab_name: "API 호출 실패",
          section_id: "1",
          subsection_id: null,
          subsection_name: null,
          members_count: null,
          members: null,
        },
        {
          tab_id: "3",
          tab_name: "API 호출 실패",
          section_id: "2",
          subsection_id: null,
          subsection_name: null,
          members_count: null,
          members: null,
        },
        {
          tab_id: "4",
          tab_name: "API 호출 실패",
          section_id: "3",
          subsection_id: null,
          subsection_name: null,
          members_count: null,
          members: null,
        },
      ];
    }

    return res.json();
  } catch (error) {
    console.error("탭 리스트 조회 중 오류:", error);
    // 에러 발생 시 기본값 반환 (테스트)
    return [
      {
        tab_id: "1",
        tab_name: "API 호출 실패",
        section_id: "0",
        subsection_id: null,
        subsection_name: null,
        members_count: null,
        members: null,
      },
      {
        tab_id: "2",
        tab_name: "API 호출 실패",
        section_id: "1",
        subsection_id: null,
        subsection_name: null,
        members_count: null,
        members: null,
      },
      {
        tab_id: "3",
        tab_name: "API 호출 실패",
        section_id: "2",
        subsection_id: null,
        subsection_name: null,
        members_count: null,
        members: null,
      },
      {
        tab_id: "4",
        tab_name: "API 호출 실패",
        section_id: "3",
        subsection_id: null,
        subsection_name: null,
        members_count: null,
        members: null,
      },
    ];
  }
}

/* 탭 추가 (섹션 타입, 탭 이름, 참여자 id 필요) */
export async function createTab(workspaceId: string, sectionId: string, tabName: string): Promise<Tab> {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) throw new Error("로그인이 필요합니다.");

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
export async function getMemberList(workspaceId: string, tabId: string): Promise<Member[]> {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) throw new Error("로그인이 필요합니다.");

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
export async function getPossibleMemberList(workspaceId: string, tabId: string): Promise<Member[]> {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) throw new Error("로그인이 필요합니다.");

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
export async function postMemberList(workspaceId: string, tabId: string, userIds: string[]): Promise<Member[]> {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) throw new Error("로그인이 필요합니다.");

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
