import React, { useEffect, useRef } from "react";
import { useMessageStore } from "@/store/messageStore";
// import { ChatEditButton } from "./chatEditButton";
// import { EditInput } from "./EditInput";
// import { updateMessage } from "@/apis/messages";
import { WebSocketClient } from "../ws/webSocketClient";
import { ShowDate } from "./ShowDate";
// import { useMessageProfileStore } from "@/store/messageProfileStore";
import { ChatProfile } from "./ChatProfile";
import { getMessages } from "@/apis/messages";
// import { ChatEditButton } from "./chatEditButton/chatEditButton";

// 채팅방 내 채팅
export function ChatPage(workspaceId: string, tabId: string) {
  const messages = useMessageStore((state) => state.messages);
  const containerRef = useRef<HTMLDivElement>(null);
  
  //////////////////// 추가 ////////////////////
  const prependMessages = useMessageStore((state) => state.prependMessages);
  
  
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    
    const handleScroll = async () => {
      if (el.scrollTop < 30) {
        const oldestId = messages[0]?.id;
        const previousHeight = el.scrollHeight;

        const res = await getMessages(workspaceId, tabId, oldestId); // 과거 메시지 요청
      
        if (res.length > 0) {
          prependMessages(res);
          // 스크롤 위치를 현재 위치만큼 유지
          requestAnimationFrame(() => {
            el.scrollTop = el.scrollHeight - previousHeight;
          });
        }
        
      }
    };
    el.addEventListener("scroll", handleScroll);
  
    return () => el.removeEventListener("scroll", handleScroll);

    // 원래 로직
    // if (el) {
    //   el.scrollTop = el.scrollHeight;
    // }
  }, [messages]);

  const dayStart = (iso: string) => {
    const d = new Date(iso);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  const initialDateKey = messages.length > 0 ? dayStart(messages[0].created_at!) : dayStart(new Date().toISOString());

  return (
    <div className="flex-1 flex-col">
      <WebSocketClient />

      <div ref={containerRef} className="text-m min-h-0 px-5 w-full">
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
              {showDateHeader &&
                (idx === 0 ? (
                  <div className="sticky top-0 date-header">
                    <ShowDate timestamp={initialDateKey} />
                  </div>
                ) : (
                  <ShowDate timestamp={initialDateKey} />
                ))}

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
