"use client";

const BASE = process.env.NEXT_PUBLIC_BASE;

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useMessageStore } from "@/store/messageStore";
import { useTabStore } from "@/store/tabStore";

interface SSEPayload {
  type: "new_message" | "invited_to_tab"; // 타입 2개임: 새 메시지 | 탭에 초대
  tab_id: number; // 메시지를 보낸 탭의 id
  sender_id?: string; // 메시지 보낸 유저의 id
}

export function SSEListener() {
  const params = useParams();
  const tabId = params.tabId as string;
  const workspaceId = params.workspaceId as string;
  const incUnread = useMessageStore((s) => s.incrementUnread);
  const addInvitedTab = useMessageStore((s) => s.addInvitedTab);
  const refreshTabs = useTabStore((s) => s.refreshTabs);

  useEffect(() => {
    const url = `${BASE}/api/sse/notifications?workspaceId=${workspaceId}`;
    const es = new EventSource(url);

    // SSE 연결
    es.onopen = () => console.log("SSE: 연결");

    // SSE 오류
    es.onerror = () => {
      console.log("SSE: 연결 끊김");
      es.close();
    } 

    // 새로운 메시지 도착함 (new_message 타입)
    es.addEventListener("new_message", (e: MessageEvent) => {
      const p: SSEPayload = JSON.parse(e.data);
      console.log("SSE: 새 메세지 도착");
      if (p.tab_id.toString() !== tabId) {
        incUnread(p.tab_id);
      }
    });

    // SSE 유지를 위한 핑
    es.addEventListener("ping", () => {
      console.log("SSE: 유지 ping");
    });

    // 새로운 탭에 초대됨
    es.addEventListener("invited_to_tab", (e: MessageEvent) => {
      const p: SSEPayload = JSON.parse(e.data);
      console.log("SSE: 새로운 탭 초대");
      addInvitedTab(p.tab_id);
      refreshTabs(); // 사이드바 갱신
    });

    return () => es.close();
  }, [workspaceId, incUnread, refreshTabs]);

  return null;
}
