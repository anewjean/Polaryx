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
  // 스토어에서 상태와 액션을 모두 가져옵니다.
  const { setLikeCount, sendFlag, messageIdToSend, userIdToSend, resetSendFlag } = useLikeStore();

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
    // sendFlag가 true이고, 소켓이 연결되어 있으며, 필요한 ID가 모두 있을 때 실행됩니다.
    if (
      sendFlag &&
      socketRef.current?.readyState === WebSocket.OPEN &&
      messageIdToSend !== null &&
      userIdToSend
    ) {
      const payload = {
        type: "like",
        messageId: messageIdToSend,
        userId: userIdToSend,
      };
      
      console.log("Like WebSocket: Sending data...", payload);
      socketRef.current.send(JSON.stringify(payload));
      
      // 전송 후, 다시 보낼 수 있도록 플래그를 리셋합니다.
      resetSendFlag();
    }
  }, [sendFlag, messageIdToSend, userIdToSend, resetSendFlag]); // 이 effect는 '좋아요' 클릭으로 상태가 바뀔 때 실행됩니다.

  return null;
}
