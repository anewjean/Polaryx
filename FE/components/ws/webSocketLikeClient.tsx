"use client";

import { useEffect, useRef } from "react";
import { useLikeStore } from "@/store/likeStore";

const NEXT_PUBLIC_WS = process.env.NEXT_PUBLIC_WS;

interface WebSocketLikeClientProps {
  workspaceId: string;
  tabId: string;
}

export function WebSocketLikeClient({
  workspaceId,
  tabId,
}: WebSocketLikeClientProps) {
  const socketRef = useRef<WebSocket | null>(null);
  const { setLikeCount, sendFlag, messageIdToSend, userIdToSend, likeAction, resetSendFlag } = useLikeStore();

  // 1. WebSocket 연결 및 수신 전용 useEffect
  useEffect(() => {
    const wsUrl = `${NEXT_PUBLIC_WS}/api/ws/like/${workspaceId}/${tabId}`;
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    console.log("Like WebSocket: Attempting to connect...");

    socket.onopen = () => {
      console.log("Like WebSocket: Connection successful.");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // 서버로부터 'like' 타입의 메시지를 받으면 like count 상태를 업데이트합니다.
        if (data.type === "like" && data.messageId !== undefined && data.likeCount !== undefined) {
          console.log("Like WebSocket: Received like update", data);
          setLikeCount(data.messageId, data.likeCount);
        }
      } catch (e) {
        console.warn("Like WebSocket: Invalid message format received:", event.data);
      }
    };

    socket.onerror = (error) => {
      console.error("Like WebSocket: An error occurred:", error);
    };

    socket.onclose = () => {
      console.log("Like WebSocket: Connection closed.");
    };

    // 컴포넌트가 언마운트될 때 웹소켓 연결을 정리합니다.
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [workspaceId, tabId, setLikeCount]); // 이 effect는 ID가 바뀔 때만 실행됩니다.

  // 2. '좋아요' 데이터 전송 감지 전용 useEffect
  useEffect(() => {
    if (
      sendFlag &&
      socketRef.current?.readyState === WebSocket.OPEN &&
      messageIdToSend !== null &&
      userIdToSend &&
      likeAction // likeAction 정보도 있는지 확인
    ) {
      // 페이로드에 'action' 필드를 추가합니다.
      const payload = {
        type: "like",
        messageId: messageIdToSend,
        userId: userIdToSend,
        action: likeAction, // 'like' 또는 'unlike'
      };
      
      console.log("Like WebSocket: Sending data with action...", payload);
      socketRef.current.send(JSON.stringify(payload));
      
      resetSendFlag();
    }
  }, [sendFlag, messageIdToSend, userIdToSend, likeAction, resetSendFlag]); // 이 effect는 '좋아요' 클릭으로 상태가 바뀔 때 실행됩니다.

  return null;
}
