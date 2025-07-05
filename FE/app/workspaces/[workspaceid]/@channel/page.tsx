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

  useEffect(() => {
    {
      console.log(1);
    }
  });

  return (
    <div className="relative text-gray-800">
      <ChatHeader />
      <ChatPage />
      <ExUpload />
      <div
        className={`fixed bottom-0 p-4`}
        style={{
          width: `${channelWidth}%`,
        }}
      >
        {/* 채팅 입력 컴포넌트 */}
        <TipTap />
      </div>
    </div>
  );
}
