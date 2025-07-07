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
import { TabMembers } from "@/components/tab/TabMembers";
import { getMemberList, getPossibleMemberList } from "@/apis/tabApi";
import { Member } from "@/apis/tabApi";

export default function ChannelDefault() {
  const { channelWidth } = useChannelStore();
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const tabId = params.tabId as string;

  const [tabMembers, setTabMembers] = useState<Member[]>([]);
  const [possibleMembers, setPossibleMembers] = useState<Member[]>([]);

  useFetchMessages("1", "1");

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
      <ChatHeader />

      {/* 2. 엑셀 업로드 버튼 : 추후 위치 수정 */}
      {/* <div className="flex-none">
        <ExUpload />
      </div> */}

      {/* 3. 채팅 리스트 + 입력창 */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* 3-1. 채팅 리스트 */}
        <ChatPage />

        {/* 3-2. 입력창 */}
        <div className="flex-none mb-5 mx-5">
          <TipTap />
        </div>
      </div>
    </div>
  );
}
