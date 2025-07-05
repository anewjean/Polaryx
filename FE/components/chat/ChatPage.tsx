import { useEffect, useRef } from "react";
import { useMessageStore } from "@/store/messageStore";
import { WebSocketClient } from "../ws/webSocketClient";
import { ShowDate } from "./ShowDate";
import { useMessageProfileStore } from "@/store/messageProfileStore";
import { ChatProfile } from "./ChatProfile";

// 채팅방 내 채팅
export function ChatPage() {
  const messages = useMessageStore((state) => state.messages);
  const profile = useMessageProfileStore((state) => state.profiles[0]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col h-full">
      <WebSocketClient />
      {profile && <ShowDate timestamp={profile.timestamp} />}

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto text-m h-170 overflow-y-auto pr-2 p-[8px_20px] w-[100%] m-[-12px -8px -16px -16px] p-[8px 8px 8px 16px]"
      >
        {messages.map((msg, idx) => {
          const prev = messages[idx - 1];
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
            <ChatProfile
              key={msg.id}
              imgSrc={msg.image ? msg.image : "/profileDefault.png"}
              nickname={msg.nickname}
              time={
                msg.created_at
                  ? new Date(msg.created_at).toLocaleTimeString("ko-KR", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : "just now"
              }
              content={msg.content}
              showProfile={showProfile}
            />
          );
        })}
      </div>
    </div>
  );
}
