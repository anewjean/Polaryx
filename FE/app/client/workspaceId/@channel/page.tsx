"use client";

import TipTap from "@/components/chat-text-area/tiptap";
import { useChannelStore } from "@/store/channelStore";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatPage } from "@/components/chat/ChatPage";
import { useFetchMessages } from "@/hooks/useFetchMessages";

export default function ChannelDefault() {
  const { channelWidth } = useChannelStore();
  // const { workspaceId, tabId } = useParams(); // note: 동적 라우팅 처리 필요
  useFetchMessages("1", "1");

  return (
    <div className="flex flex-col w-full h-full text-gray-800">
      <ChatHeader />
      <div className="mx-3 flex-1 overflow-y-auto">
        <ChatPage />
      </div>
      <div className="m-6">
        <TipTap />
      </div>
    </div>
  );
}
