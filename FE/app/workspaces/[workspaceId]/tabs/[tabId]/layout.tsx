"use client";

import { ChatHeader } from "@/components/chat/ChatHeader";

export default function TabLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* 1. 상단 헤더 */}
      <ChatHeader />

      {/* 2. 선택된 컨텐츠 영역 (message 또는 canvas) */}
      <div className="flex-1 flex flex-col min-h-0 mt-0.5">
        {children}
      </div>
    </div>
  );
}
