"use client";

import TipTap from "@/components/chat-text-area/tiptap";
import { WebSocketClient } from "@/components/ws/webSocketClient";
import { useChannelStore } from "@/store/channelStore";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatPage } from "@/components/chat/ChatPage";
import { useParams } from "next/navigation";
import { useFetchMessages } from "@/hooks/useFetchMessages";
import { useEffect, useState } from "react";
import { ExUpload } from "@/components/excel_import/exImportButton";
import { TabMembers } from "@/components/modal/TabMembers";
import { getMemberList, getPossibleMemberList } from "@/apis/tabApi";
import { Member } from "@/apis/tabApi";
import { getTabInfo } from "@/apis/tabApi";

export default function ChannelDefault() {
  const { channelWidth } = useChannelStore();
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const tabId = params.tabId as string;

  // 만약 터지면 여기부터 확인해볼 것.
  const [tabMembers, setTabMembers] = useState<Member[]>([]);
  const [possibleMembers, setPossibleMembers] = useState<Member[]>([]);

  // 탭 정보 가져오기
  const [tabName, setTabName] = useState<string>(""); // 탭 이름
  const [sectionId, setSectionId] = useState<number>(0); // 섹션 ID

  useEffect(() => {
    if (!workspaceId || !tabId) return;

    (async () => {
      console.log("탭 정보 조회 시작");
      try {
        const info = await getTabInfo(workspaceId, tabId);
        setTabName(info.tab_name); // tab_name 불러오기
        setSectionId(info.section_id ? info.section_id : 0); // section_id 불러오기
      } catch (e) {
        console.log("탭 정보 조회 실패:", e);
      }
    })();
  }, [workspaceId, tabId]);
  useFetchMessages(workspaceId, tabId);

  useEffect(() => {
    if (workspaceId && tabId) {
      const fetchData = async () => {
        try {
          const [tabMembersData, possibleMembersData] = await Promise.all([
            getMemberList(workspaceId, tabId),
            getPossibleMemberList(workspaceId, tabId),
          ]);
          setTabMembers(tabMembersData);
          setPossibleMembers(possibleMembersData);
        } catch (error) {
          console.error("Failed to fetch members:", error);
        }
      };
      fetchData();
    }
  }, [workspaceId, tabId]);

  return (
    <div className="flex flex-col h-full">
      {/* 1. 상단 헤더 */}
      <ChatHeader sectionId={sectionId} tabName={tabName} />

      {/* 2. 엑셀 업로드 버튼 : 추후 위치 수정 */}
      {/* <div className="flex-none">
        <ExUpload />
      </div> */}

      {/* 3. 채팅 리스트 + 입력창 */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* 3-1. 채팅 리스트 */}
        <ChatPage workspaceId={workspaceId} tabId={tabId} />

        {/* 3-2. 입력창 */}
        <div className="flex-none mb-5 mx-5">
          <TipTap />
        </div>
      </div>
    </div>
  );
}
