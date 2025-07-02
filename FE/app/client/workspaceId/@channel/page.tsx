"use client";

import TipTap from "@/components/chat-text-area/tiptap";
import { WebSocketClient } from "@/components/ws/webSocketClient";
import { useChannelStore } from "@/store/channelStore";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatPage } from "@/components/chat/ChatPage";

export default function ChannelDefault() {
  const { channelWidth } = useChannelStore();

  return (
    <div className="relative text-gray-800">
      <ChatHeader />
      <ChatPage />
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
