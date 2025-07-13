import React, { useEffect, useRef, useState } from "react";
import { useMessageStore } from "@/store/messageStore";
import { WebSocketClient } from "../ws/webSocketClient";
import { ShowDate } from "./ShowDate";
import { ChatProfile } from "./ChatProfile";
import { useFetchMessages } from "@/hooks/useFetchMessages";
import { getMessages } from "@/apis/messageApi";
import { Skeleton } from "@/components/ui/skeleton";

function SkeletonChat() {
  return (
    <div className="flex px-[8px] py-[4.5px]">
      <Skeleton className="w-[40px] h-[40px] mt-1 mr-[8px] rounded-lg" />
      <div className="mt-1 space-y-2">
        <Skeleton className="h-4 w-[70px]" />
        <Skeleton className="h-10 w-[300px]" />
      </div>
    </div>
  );
}

// 채팅방 내 채팅
export function ChatPage({
  workspaceId,
  tabId,
}: {
  workspaceId: string;
  tabId: string;
}) {
  const { messages, prependMessages } = useMessageStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const isFetching = useRef(false);
  const prevMessageLengthRef = useRef(0);

  const [isLoading, setIsLoading] = useState(true); // 스켈레톤 로딩을 위한 로딩 상태 관리

  // 최초 메시지 불러오기 + 로딩 해제
  useEffect(() => {
    (async () => {
      await getMessages(workspaceId, tabId, undefined)
        .then((res) => {
          if (res.messages.length) prependMessages(res.messages);
        })
        .finally(() => {
          setIsLoading(false);
        });
    })();
  }, [workspaceId, tabId, prependMessages]);

  // 새로운 메세지가 추가되었을 때,
  useEffect(() => {
    if (isLoading) return; // 로딩 중이면 스킵

    console.log("메세지 추가됐음.");
    const el = containerRef.current;
    if (!el) return;

    // 최초 30개의 메세지에 대해서만 가장 하단으로 스크롤 내려가게
    // + 새 채팅 쳤을 때, 가장 하단으로
    // 둘의 공통점은? message[-1] 이 변했을 경우
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });

    // 길이 업데이트
    prevMessageLengthRef.current = messages.length;
  }, [messages[messages.length - 1], isLoading]);

  // 스크롤을 올려서 과거 메세지들을 불러와
  // messages에 변화가 생겨 새로 렌더링 해줘야 하는 경우.
  const handleScroll = async (event: React.UIEvent<HTMLDivElement>) => {
    const el = event.currentTarget;
    if (el.scrollTop < 30 && !isFetching.current) {
      isFetching.current = true;

      const oldestId = messages[0]?.msgId;
      const previousHeight = el.scrollHeight;

      // console.log("oldestID:", oldestId);
      // console.log("old:", messages);
      // console.log("previousHeight:", previousHeight);
      const res = await getMessages(workspaceId, tabId, oldestId); // 과거 메시지 요청

      // console.log(res["messages"]);

      const new_messages = res.messages.map((msg: any) => ({
        senderId: msg.sender_id,
        msgId: msg.msg_id,
        nickname: msg.nickname,
        content: msg.content,
        image: msg.image,
        createdAt: msg.created_at,
        isUpdated: msg.is_updated,
        fileUrl: msg.file_url,
      }));
      
      if (new_messages) {
        prependMessages(new_messages);
        isFetching.current = false;
        // 스크롤 위치를 현재 위치만큼 유지
        requestAnimationFrame(() => {
          const newHeight = el.scrollHeight;
          const heightDiff = newHeight - previousHeight;
          el.scrollTop = heightDiff;
        });
      }
    }
  };

  // 로딩 중이면, 스켈레톤 이미지 보여줌
  if (isLoading) {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="sticky top-1.5 mx-auto w-[120px] h-[28px] my-2 bg-[#f5f5f5] flex items-center justify-center rounded-full" />
        <div className="text-m min-h-0 pl-5 w-full">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonChat key={i} />
          ))}
        </div>
      </div>
    );
  }

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

          if (
            prev &&
            prev.nickname === msg.nickname &&
            prev.createdAt &&
            msg.createdAt
          ) {
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
                senderId={msg.senderId ? msg.senderId : ""}
                msgId={msg.msgId ? msg.msgId : 0}
                imgSrc={msg.image ? msg.image : "/user_default.png"}
                nickname={msg.nickname}
                time={
                  msg.createdAt ? 
                  new Date(msg.createdAt).toLocaleTimeString("ko-KR", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "now"
                }
                content={msg.content}
                showProfile={showProfile}
                fileUrl={msg.fileUrl}
                isUpdated={msg.isUpdated}
              />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}