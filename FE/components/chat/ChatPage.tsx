import React, { useEffect, useRef } from "react";
import { useMessageStore } from "@/store/messageStore";
import { WebSocketClient } from "../ws/webSocketClient";
import { ShowDate } from "./ShowDate";
import { ChatProfile } from "./ChatProfile";
// import { useMessageProfileStore } from "@/store/messageProfileStore";
// import { ChatEditButton } from "./chatEditButton";
// import { EditInput } from "./EditInput";
// import { updateMessage } from "@/apis/messages";
import { getMessages } from "@/apis/messages";
// import { ChatEditButton } from "./chatEditButton/chatEditButton";

// 채팅방 내 채팅
export function ChatPage(workspaceId: string, tabId: string) {
  const messages = useMessageStore((state) => state.messages);
  
  //////////////////// 추가 ////////////////////
  const prependMessages = useMessageStore((state) => state.prependMessages);
  
  const handleScroll = async (event: React.UIEvent<HTMLDivElement>) => {
    const el = event.currentTarget; 
    console.log("in handle scroll")
    console.log("messages:", messages);
    if (el.scrollTop < 30) {
      const oldestId = messages[0]?.id;
      const previousHeight = el.scrollHeight/2;

      console.log("oldestID:", oldestId);
      console.log("previousHeight:", previousHeight);
      const res = await getMessages("1", "1", oldestId); // 과거 메시지 요청
    
      console.log(res["messages"]);

      if (res["messages"].length > 0) {        
        prependMessages(res["messages"]);
        // 스크롤 위치를 현재 위치만큼 유지
        console.log("messages + res");
        console.log(messages);

        requestAnimationFrame(() => {
          el.scrollTop = el.scrollHeight - previousHeight;
        });
      }
    }
  };
  

  const dayStart = (iso: string) => {
    const d = new Date(iso);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto" onScroll={(event)=> {
      handleScroll(event)
    }}>
      <WebSocketClient />

      {/* <div ref={containerRef} className="flex-1 overflow-y-auto min-h-0 text-m px-5 w-full"></div> */}
      <div className="text-m min-h-0 px-5 w-full">
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
                imgSrc={msg.image != 'none_image' ? msg.image : "/profileDefault.png"}
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
