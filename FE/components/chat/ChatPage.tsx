import React, { useEffect, useRef, useState } from "react";
import { useMessageStore } from "@/store/messageStore";
// import { useMessageProfileStore } from "@/store/messageProfileStore";
// import { ChatEditButton } from "./chatEditButton";
import { EditInput } from "./EditInput";
import { updateMessage } from "@/apis/messages";
import { WebSocketClient } from "../ws/webSocketClient";
import { ShowDate } from "./ShowDate";
import { useMessageProfileStore } from "@/store/messageProfileStore";
import { ChatProfile } from "./ChatProfile";
import { ChatEditButton } from "./chatEditButton/chatEditButton";
import { getMessages } from "@/apis/messages";

// 채팅방 내 채팅
export function ChatPage({ workspaceId, tabId }: { workspaceId: string; tabId: string }) {
  const messages = useMessageStore((state) => state.messages);
  //////////////////// 추가 ////////////////////
  const prependMessages = useMessageStore((state) => state.prependMessages);
  const containerRef = useRef<HTMLDivElement>(null);
  const isFetching = useRef(false);
  const prevMessageLengthRef = useRef(0);

  // useEffect(() => {
  //   const el = containerRef.current;
  //   if (el) {
  //     el.scrollTop = el.scrollHeight;
  //   }
  // }, [messages]);

  // 새로운 메세지가 추가되었을 때, 
  useEffect(() => {
    console.log("메세지 추가됐음.")
    const el = containerRef.current;
    if (!el) return;

    // 새로운 메시지가 추가되었는지 확인
    if (messages.length > prevMessageLengthRef.current) {
      // 가장 최근 메시지가 추가된 상황으로 판단
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    }

    // 길이 업데이트
    prevMessageLengthRef.current = messages.length;
  }, [messages]);
  

    
  // 스크롤을 올려서 과거 메세지들을 불러와
  // messages에 변화가 생겨 새로 렌더링 해줘야 하는 경우.
  const handleScroll = async (event: React.UIEvent<HTMLDivElement>) => {
    const el = event.currentTarget; 
    console.log("in handle scroll")
    if (el.scrollTop < 30 && !isFetching.current) {
    // if (!isFetching.current) {
      isFetching.current = true;

      const oldestId = messages[0]?.id;
      const previousHeight = el.scrollHeight;

      console.log("oldestID:", oldestId);
      console.log("previousHeight:", previousHeight);
      const res = await getMessages(workspaceId, tabId, oldestId); // 과거 메시지 요청

      console.log(res["messages"]);

      if (res["messages"].length > 0) {
        prependMessages(res["messages"]);
        // 스크롤 위치를 현재 위치만큼 유지
        console.log("messages + res");
        console.log(messages);

        isFetching.current = false;
        // isFetching.current = false; // 요청 완료 후 플래그 초기화
        requestAnimationFrame(() => {
          el.scrollTop = el.scrollHeight - previousHeight;
          // el.scrollTop = el.scrollHeight;
        }
      );
      }
    }
  };

  const dayStart = (iso: string) => {
    const d = new Date(iso);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 min-h-0 overflow-y-auto"
      onScroll={(event) => {
        handleScroll(event);
      }}
    >
      <WebSocketClient />

      {/* <div ref={containerRef} className="flex-1 overflow-y-auto min-h-0 text-m px-5 w-full"></div> */}
      <div className="text-m min-h-0 px-5 w-full">
        {
        messages.map((msg, idx) => {
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
                key={msg.id}
                imgSrc={msg.image != "none_image" ? msg.image : "/profileDefault.png"}
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
                fileUrl={msg.file_url}
                />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
