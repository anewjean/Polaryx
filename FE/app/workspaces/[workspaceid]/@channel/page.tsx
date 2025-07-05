"use client";

import TipTap from "@/components/chat-text-area/tiptap";
import { WebSocketClient } from "@/components/ws/webSocketClient";
import { useChannelStore } from "@/store/channelStore";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatPage } from "@/components/chat/ChatPage";
import { useParams } from "next/navigation";
import { useFetchMessages } from "@/hooks/useFetchMessages";
import { useEffect } from "react";

export default function ChannelDefault() {
  const { channelWidth } = useChannelStore();
  // const { workspaceId, tabId } = useParams(); // note: 동적 라우팅 처리 필요
  useFetchMessages("1", "1");
  
  useEffect(()=>{
    {console.log(1)}
  })
  
  return (
    <div className="relative text-gray-800">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto">
        <ChatPage />
      </div>
      <div className="mb-5 mx-5">
        <TipTap />
      </div>
    </div>
  );
}
