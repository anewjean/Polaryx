"use client";

import TipTap from "@/components/chat-text-area/tiptap";
import { WebSocketClient } from "@/components/ws/webSocketClient";
import { useChannelStore } from "@/store/channelStore";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatPage } from "@/components/chat/ChatPage";
import { useParams } from "next/navigation";
import { useFetchMessages } from "@/hooks/useFetchMessages";
import { useEffect } from "react";
import { ExUpload } from "@/components/excel_import/exImportButton";

export default function ChannelDefault() {
  const { channelWidth } = useChannelStore();
  // const { workspaceId, tabId } = useParams(); // note: 동적 라우팅 처리 필요
  useFetchMessages("1", "1");

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
        {/* 3-1. 채팅 리스트 : 남은 공간 사용, 스크롤 가능하게 */}

        <ChatPage />

        {/* 3-2. 입력창 */}
        <div className="flex-none mb-5 mx-5">
          <TipTap />
        </div>
      </div>
    </div>
  );
}
