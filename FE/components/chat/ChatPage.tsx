import React, { useEffect, useRef } from "react";
import { useMessageStore } from "@/store/messageStore";
import { WebSocketClient } from "../ws/webSocketClient";
import { ShowDate } from "./ShowDate";
import { ChatProfile } from "./ChatProfile";
// import { useMessageProfileStore } from "@/store/messageProfileStore";
// import { ChatEditButton } from "./chatEditButton";
// import { EditInput } from "./EditInput";
// import { updateMessage } from "@/apis/messages";
// import { ChatEditButton } from "./chatEditButton/chatEditButton";

// 채팅방 내 채팅
export function ChatPage() {
  const messages = useMessageStore((state) => state.messages);
  const containerRef = useRef<HTMLDivElement>(null);

  // 맨 아래 채팅에 고정
  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  const dayStart = (iso: string) => {
    const d = new Date(iso);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <WebSocketClient />

      <div ref={containerRef} className="flex-1 overflow-y-auto min-h-0 text-m px-5 w-full">
        {messages.map((msg, idx) => {
          const prev = messages[idx - 1];
          const todayKey = dayStart(msg.created_at!);
          const prevKey = prev ? dayStart(prev.created_at!) : null;
          const showDateHeader = prevKey === null || todayKey !== prevKey;

          let showProfile = true;

          if (prev && prev.nickname === msg.nickname && prev.created_at && msg.created_at) {
            const prevTime = new Date(prev.created_at).getTime();
            const currTime = new Date(msg.created_at).getTime();
            const diff = currTime - prevTime;

            if (diff <= 5 * 60 * 1000) {
              showProfile = false;
            }
          }

          return (
            <React.Fragment key={msg.id}>
              {/* 날짜 헤더 : sticky 추가 */}
              {showDateHeader && <ShowDate timestamp={todayKey} />}

              {/* 각각의 채팅 */}
              <ChatProfile
                imgSrc={msg.image ? msg.image : "/profileDefault.png"}
                nickname={msg.nickname}
                time={
                  msg.created_at
                    ? new Date(msg.created_at).toLocaleTimeString("ko-KR", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : // .split(" ")[1]
                      "now"
                }
                content={msg.content}
                showProfile={showProfile}
              />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
