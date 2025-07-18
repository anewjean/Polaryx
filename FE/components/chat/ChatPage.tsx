import React, { useEffect, useRef, useState } from "react";
import { useMessageStore } from "@/store/messageStore";
import { WebSocketClient } from "../ws/webSocketClient";
import { ShowDate } from "./ShowDate";
import { ChatProfile } from "./ChatProfile";
import { getMessages } from "@/apis/messageApi";
import { Skeleton } from "@/components/ui/skeleton";
import { SSEListener } from "../sse/SSEListener";
import { WebSocketLikeClient } from "../ws/webSocketLikeClient";
import { useLikeStore } from "@/store/likeStore";

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
  className = "",
}: {
  workspaceId: string;
  tabId: string;
  className?: string;
}) {
  const { messages, prependMessages, setMessages } = useMessageStore();
  // 스토어에서 상태와 액션을 모두 가져옵니다.
  const { likes, myLikes, setInitialState } = useLikeStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const isFetching = useRef(false);
  const prevMessageLengthRef = useRef(0);
  const [isLoading, setIsLoading] = useState(true);

  // 최초 메시지 불러오기 + 로딩 해제
  useEffect(() => {
    (async () => {
      const res = await getMessages(workspaceId, tabId, undefined);
      if (res.messages && res.messages.length) {
        const initialLikesData: Record<number, number> = {};
        const initialMyLikesData: number[] = [];
        const new_messages = res.messages.map((msg: any) => {
          if (msg.like_count > 0) {
            initialLikesData[msg.msg_id] = msg.like_count;
          }
          if (msg.is_liked_by_me) {
            initialMyLikesData.push(msg.msg_id);
          }
          return {
            senderId: msg.sender_id, msgId: msg.msg_id, nickname: msg.nickname,
            content: msg.content, image: msg.image, createdAt: msg.created_at,
            isUpdated: msg.is_updated, fileUrl: msg.file_url,
          };
        });
        setMessages(new_messages);
        ///////////////////////////////////////////////////////////////
        // 스토어의 초기 상태를 한 번에 설정합니다.
        setInitialState(initialLikesData, initialMyLikesData);
        ///////////////////////////////////////////////////////////////
      } else {
        setMessages([]);
        ///////////////////////////////////////////////////////////////
        // 초기 상태 설정
        setInitialState({}, []);
        ///////////////////////////////////////////////////////////////
      }
      setIsLoading(false);
    })();
  }, [workspaceId, tabId, setMessages, setInitialState]);

  // 새로운 메세지가 추가되었을 때,
  useEffect(() => {
    if (!isLoading && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [isLoading]);

  useEffect(() => {
    // 최초 로딩 중에는 이 훅이 동작하지 않도록 방지
    if (isLoading) return;

    const el = containerRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      const newHeight = el.scrollHeight;
      el.scrollTop = newHeight;
    });
  }, [messages[messages.length - 1], isLoading]);

  // 스크롤을 올려서 과거 메세지들을 불러와
  const handleScroll = async (event: React.UIEvent<HTMLDivElement>) => {
    const el = event.currentTarget;
    if (el.scrollTop < 30 && !isFetching.current && messages.length > 0) {
      isFetching.current = true;
      const oldestId = messages[0]?.msgId;
      const previousHeight = el.scrollHeight;

      const res = await getMessages(workspaceId, tabId, oldestId);

      if (res.messages && res.messages.length > 0) {
        const initialLikesData: Record<number, number> = {};
        const initialMyLikesData: number[] = [];
        
        const new_messages = res.messages.map((msg: any) => {
           if (msg.like_count > 0) initialLikesData[msg.msg_id] = msg.like_count;
           if (msg.is_liked_by_me) initialMyLikesData.push(msg.msg_id);
           return {
            senderId: msg.sender_id, msgId: msg.msg_id, nickname: msg.nickname,
            content: msg.content, image: msg.image, createdAt: msg.created_at,
            isUpdated: msg.is_updated, fileUrl: msg.file_url,
          };
        });
        prependMessages(new_messages);
        ///////////////////////////////////////////////////////////////
        // 스토어의 초기 상태를 한 번에 설정합니다.
        setInitialState(initialLikesData, initialMyLikesData);
        ///////////////////////////////////////////////////////////////
        requestAnimationFrame(() => {
            const newHeight = el.scrollHeight;
            el.scrollTop = newHeight - previousHeight;
        });
      }
      isFetching.current = false;
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
      className={`flex-1 min-h-0 overflow-y-auto scrollbar-thin ${className}`}
      onScroll={(event) => {
        handleScroll(event);
      }}
    >
      <SSEListener />
      <WebSocketLikeClient workspaceId={workspaceId} tabId={tabId} />
      <WebSocketClient workspaceId={workspaceId} tabId={tabId} />
      <div className="text-m pl-5 w-full">
        {messages.map((msg, idx) => {
          const prev = messages[idx - 1];
          const todayKey = msg.createdAt ? dayStart(msg.createdAt) : null;
          const prevKey = prev?.createdAt ? dayStart(prev.createdAt) : null;
          const showDateHeader =
            todayKey !== null && (prevKey === null || todayKey !== prevKey);

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
              {showDateHeader && todayKey && <ShowDate timestamp={todayKey} />}
              <ChatProfile
                senderId={msg.senderId || ""}
                msgId={msg.msgId || 0}
                imgSrc={msg.image || "/user_default.png"}
                nickname={msg.nickname}
                time={
                  msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString("ko-KR", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : " "
                }
                content={msg.content}
                showProfile={showProfile}
                fileUrl={msg.fileUrl}
                isUpdated={msg.isUpdated}
                likeCount={likes[msg.msgId || 0] || 0}
                // 스토어에서 '내가 좋아요 눌렀는지' 여부를 가져와 전달합니다.
                isLikedByMe={myLikes.has(msg.msgId || 0)}
              />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
