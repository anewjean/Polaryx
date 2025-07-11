import React, { useEffect, useRef, useState } from "react";
import { useMessageStore } from "@/store/messageStore";
// import { updateMessage } from "@/apis/messageApi";
import { WebSocketClient } from "../ws/webSocketClient";
import { ShowDate } from "./ShowDate";
// import { useMessageProfileStore } from "@/store/messageProfileStore";
import { ChatProfile } from "./ChatProfile";
// import { ChatEditButton } from "./chatEditButton/chatEditButton";
import { getMessages } from "@/apis/messageApi";
// import { elementFromString } from "@tiptap/core";

// 채팅방 내 채팅
export function ChatPage({ workspaceId, tabId }: { workspaceId: string; tabId: string }) {
  const messages = useMessageStore((state) => state.messages);
  const prependMessages = useMessageStore((state) => state.prependMessages);
  const containerRef = useRef<HTMLDivElement>(null);
  const isFetching = useRef(false);
  const prevMessageLengthRef = useRef(0);

  // 새로운 메세지가 추가되었을 때,
  useEffect(() => {
    console.log("메세지 추가됐음.");
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
    console.log("in handle scroll");
    if (el.scrollTop < 30 && !isFetching.current) {
      isFetching.current = true;

      const oldestId = messages[0]?.msgId;
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
        requestAnimationFrame(() => {
          el.scrollTop = el.scrollHeight - previousHeight;
          // el.scrollTop = el.scrollHeight;
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
    <div
      ref={containerRef}
      className="flex-1 min-h-0 overflow-y-auto"
      onScroll={(event) => {
        handleScroll(event);
      }}
    >
      <WebSocketClient workspaceId={workspaceId} tabId={tabId} />

      {/* <div ref={containerRef} className="flex-1 overflow-y-auto min-h-0 text-m px-5 w-full"></div> */}
      <div className="text-m min-h-0 pl-5 w-full">
        {messages.map((msg, idx) => {
          const prev = messages[idx - 1];
          const todayKey = dayStart(msg.createdAt!);
          const prevKey = prev ? dayStart(prev.createdAt!) : null;
          const showDateHeader = prevKey === null || todayKey !== prevKey;

          let showProfile = true;

          if (prev && prev.nickname === msg.nickname && prev.createdAt && msg.createdAt) {
            const prevTime = new Date(prev.createdAt).getTime();
            const currTime = new Date(msg.createdAt).getTime();
            const diff = currTime - prevTime;

            if (diff <= 5 * 60 * 1000) {
              showProfile = false;
            }
          }

          return (
            <React.Fragment key={msg.msgId}>
              {/* 날짜 헤더 : sticky 추가 */}
              {showDateHeader && <ShowDate timestamp={todayKey} />}

              {/* 각각의 채팅 */}
              <ChatProfile
                senderId={msg.senderId ? msg.senderId : Buffer.from("")}
                msgId={msg.msgId ? msg.msgId : 0}
                imgSrc={msg.image ? msg.image : "/user_default.png"}
                nickname={msg.nickname}
                time={
                  msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString("ko-KR", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : // .split(" ")[1]
                      "now"
                }
                content={msg.content}
                showProfile={showProfile}
                fileUrl={msg.fileUrl}
              />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
