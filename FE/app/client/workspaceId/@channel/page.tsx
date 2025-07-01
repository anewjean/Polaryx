"use client";

import MessageList from "@/components/chat-text-area/MessageList";
import TipTap from "@/components/chat-text-area/tiptap";
import { WebSocketClient } from "@/components/ws/webSocketClient";
import { useChannelStore } from "@/store/channelStore";

export default function ChannelDefault() {
  const { channelWidth } = useChannelStore();

  return (
    <div className="relative text-gray-800">
      <MessageList />
      <div
        className={`fixed bottom-0 p-4`}
        style={{
          width: `${channelWidth}%`,
        }}
      >
        {/* 채팅 입력 컴포넌트 */}
        <TipTap />
        <WebSocketClient />
      </div>
    </div>
  );
}
