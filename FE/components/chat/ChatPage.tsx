import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMessageStore } from "@/store/messageStore";
import { WebSocketClient } from "../ws/webSocketClient";
import { ShowDate } from "./ShowDate";
import { ChatProfile } from "./ChatProfile";
import { getMessages } from "@/apis/messageApi";
import { Skeleton } from "@/components/ui/skeleton";
import { SSEListener } from "../sse/SSEListener";
import { WebSocketLikeClient } from "../ws/webSocketLikeClient";
import { WebSocketProfileClient } from "../ws/webSocketProfileClient";

function SkeletonChat() {
  return (
    <div className="flex px-[8px] py-[4.5px]">
      <Skeleton className="w-[40px] h-[40px] mt-1 mr-[8px] rounded-lg bg-gray-300" />
      <div className="mt-1 space-y-2">
        <Skeleton className="h-4 w-[70px] bg-gray-300" />
        <Skeleton className="h-10 w-[300px] bg-gray-300" />
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

  const containerRef = useRef<HTMLDivElement>(null);
  
  const isFetching = useRef(false);

  const [editingMsgId, setEditingMsgId] = useState<number | null>(null);

  // 로딩 상태 관리
  const [isLoading, setIsLoading] = useState(true);

  const [isBottom, setIsBottom] = useState(false);  
  
  // 가장 최근 메시지의 ID를 메모이제이션  
  const lastMsgId = useMemo(() => {
    return messages.length > 0 ? messages[messages.length - 1].msgId : null;
  }, [messages]);

  // 이모지 개수 변경 감지를 위해 이전 메시지들의 이모지 총합을 저장하는 ref
  const prevMessageLengths = useRef<number[]>([]);
  
  // 메시지가 변경될 때마다 (새 메시지 또는 이모지 업데이트) 스크롤 위치 조정
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 사용자가 현재 스크롤이 하단 근처에 있는지 확인 (100px 이내)
    const isAtBottom = 
      container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    // 사용자가 하단 근처에 있거나 초기 로딩 시 스크롤을 하단으로 이동
    if (isAtBottom || prevMessageLengths.current.length === 0) {
      container.scrollTop = container.scrollHeight;
    }

    // 각 메시지의 이모지 총합을 계산하여 저장 (변경 감지용)
    prevMessageLengths.current = messages.map(m => 
      m.checkCnt + m.prayCnt + m.sparkleCnt + m.clapCnt + m.likeCnt
    );
  }, [messages]);

  // 최초 메시지 불러오기 + 로딩 해제
  useEffect(() => {
    (async () => {
      const res = await getMessages(workspaceId, tabId, undefined);
      if (res.messages && res.messages.length) {
        const new_messages = res.messages.map((msg: any) => {
          return {
            senderId: msg.sender_id,
            msgId: msg.msg_id,
            nickname: msg.nickname,
            content: msg.content,
            image: msg.image,
            createdAt: msg.created_at,
            isUpdated: msg.is_updated,
            fileUrl: msg.file_url,
            checkCnt: msg.e_check_cnt,
            clapCnt: msg.e_clap_cnt,
            likeCnt: msg.e_like_cnt,
            sparkleCnt: msg.e_sparkle_cnt,
            prayCnt: msg.e_pray_cnt,
            myToggle: msg.my_toggle,
          };
        });
        console.log("getmessages, chatpage: ", new_messages[0].myToggle);
        setMessages(new_messages);
      } else {
        setMessages([]);
      }
      setIsLoading(false);
      setIsBottom(true);
    })();
  }, [workspaceId, tabId, setMessages]);

  // 스크롤이 최하단인 경우 메세지 이모지 넣을때,
  useEffect(() => {
    if (isBottom && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [...messages.slice(-12)]);

  useEffect(() => {
    if (isBottom && containerRef.current) {
      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      });
      console.log("containerRef.current.scrollTop", containerRef.current.scrollTop)
    }
  }, [editingMsgId]);

  useEffect(() => {
    // 최초 로딩 중에는 이 훅이 동작하지 않도록 방지
    if (isLoading) return;

    const el = containerRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      const newHeight = el.scrollHeight;
      el.scrollTop = newHeight;
    });
  }, [lastMsgId, isLoading]);

  // 스크롤을 올려서 과거 메세지들을 불러와
  const handleScroll = async (event: React.UIEvent<HTMLDivElement>) => {
    const el = event.currentTarget;

    if (el.scrollHeight - el.scrollTop - el.clientHeight <= 30) setIsBottom(true);
    else setIsBottom(false);

    if (el.scrollTop < 30 && !isFetching.current && messages.length > 0) {
      isFetching.current = true;
      const oldestId = messages[0]?.msgId;
      const previousHeight = el.scrollHeight;

      const res = await getMessages(workspaceId, tabId, oldestId);

      if (res.messages && res.messages.length > 0) {
        const new_messages = res.messages.map((msg: any) => {
          return {
            senderId: msg.sender_id,
            msgId: msg.msg_id,
            nickname: msg.nickname,
            content: msg.content,
            image: msg.image,
            createdAt: msg.created_at,
            isUpdated: msg.is_updated,
            fileUrl: msg.file_url,
            checkCnt: msg.e_check_cnt,
            clapCnt: msg.e_clap_cnt,
            likeCnt: msg.e_like_cnt,
            sparkleCnt: msg.e_sparkle_cnt,
            prayCnt: msg.e_pray_cnt,
            myToggle: msg.my_toggle,
          };
        });
        prependMessages(new_messages);
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
      <div className="flex flex-col justify-start w-full">
        <div className="sticky top-1.5 mx-auto w-[120px] h-[28px] z-1 my-2">
          <Skeleton className="w-full h-full bg-gray-300 rounded-full" />
        </div>
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
    <div className={`flex flex-col w-full h-full ${className}`}>
      <SSEListener />
      <WebSocketLikeClient workspaceId={workspaceId} tabId={tabId} />
      <WebSocketProfileClient workspaceId={workspaceId} tabId={tabId} />
      <WebSocketClient workspaceId={workspaceId} tabId={tabId} />
      {/* 날짜 헤더의 sticky를 위함, overflow-y-auto scrollbar-thin의 위치는 여기에 고정되어야 함 */}
      <div
        className="flex-1 overflow-y-auto scrollbar-thin"
        ref={containerRef}
        onScroll={(event) => {
          handleScroll(event);
        }}
      >
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
                checkCnt={msg.checkCnt}
                prayCnt={msg.prayCnt}
                sparkleCnt={msg.sparkleCnt}
                clapCnt={msg.clapCnt}
                likeCnt={msg.likeCnt}
                myToggle={msg.myToggle}
                isEditMode={editingMsgId === msg.msgId}
                onStartEdit={() => setEditingMsgId(msg.msgId ? msg.msgId:0)}
                onEndEdit={() => setEditingMsgId(null)}
              />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
