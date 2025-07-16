"use client";

import { ChatPage } from "@/components/chat/ChatPage";
import TipTap from "@/components/chat-text-area/tiptap";
import { useParams } from "next/navigation";

export default function ChannelDefault() {
  // 파라미터에서 workspaceId와 tabId 추출
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const tabId = params.tabId as string;
  
  return (
    <div className="flex flex-col h-full">
      {/* 채팅 리스트 - 고정 높이를 제외한 나머지 영역 차지, 스크롤 가능 */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin">
        <ChatPage workspaceId={workspaceId} tabId={tabId} />
      </div>

      {/* 입력창 - 고정된 높이로 설정 */}
      <div className="flex-none mb-5 mx-5 mt-0">
        <TipTap />
      </div>
    </div>
  );
}
