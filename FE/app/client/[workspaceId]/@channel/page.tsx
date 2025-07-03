"use client";

import TipTap from "@/components/chat-text-area/tiptap";
import { useChannelStore } from "@/store/channelStore";

export default function ChannelDefault() {
  const { channelWidth } = useChannelStore();

  return (
    <div className="relative text-gray-800">
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
