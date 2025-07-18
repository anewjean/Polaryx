"use client";

import { useEffect, useRef } from "react";
import { useLikeStore } from "@/store/likeStore";

const NEXT_PUBLIC_WS = process.env.NEXT_PUBLIC_WS;

interface LikeEvent {
  type: "like";
  messageId: number;
  userId: string;
  likeCount: number;
}

interface WebSocketLikeClientProps {
  workspaceId: string;
  tabId: string;
}

export function WebSocketLikeClient({
  workspaceId,
  tabId,
}: WebSocketLikeClientProps) {
  const socketRef = useRef<WebSocket | null>(null);
  const { setLikeCount, setSendLike } = useLikeStore();

  useEffect(() => {
    const wsUrl = `${NEXT_PUBLIC_WS}/api/ws/like/${workspaceId}/${tabId}`;
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    // 이 sendLike 함수는 아래 onopen 핸들러 안에서 사용됩니다.
    const sendLike = (messageId: number, userId: string) => {
        // 만약을 위해 한번 더 체크
        console.log("like socket")
      if (socket.readyState === WebSocket.OPEN) {
        const payload = {
          type: "like",
          // 백엔드 ws_message.py와 키 이름을 맞춥니다 (userId, messageId)
          userId: userId,
          messageId: messageId,
        };
        console.log("WebSocket: Sending like data", payload);
        socket.send(JSON.stringify(payload));
      } else {
        console.warn(
          "Could not send like. WebSocket not ready. State:",
          socket.readyState
        );
      }
    };

    // 1. 웹소켓 연결이 성공하면...
    socket.onopen = () => {
      console.log("Like WebSocket connected. Registering sendLike function.");
      // 2. ...그때 비로소 sendLike 함수를 스토어에 등록합니다.
      setSendLike(() => sendLike);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // 백엔드에서 온 데이터 키(messageId, likeCount)에 맞춰 수정
        if (data.type === "like") {
          setLikeCount(data.messageId, data.likeCount);
        }
      } catch (e) {
        console.warn("Invalid like event: ", event.data);
      }
    };

    socket.onerror = (error) => {
      console.error("Like WebSocket error", error);
    };

    // 3. 연결이 닫히면 스토어의 함수도 비워줍니다.
    socket.onclose = () => {
      console.log("Like WebSocket closed. Deregistering sendLike function.");
      setSendLike(null);
    };

    // 컴포넌트가 언마운트될 때 정리
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
      setSendLike(null);
    };
  }, [workspaceId, tabId, setLikeCount, setSendLike]);

  return null;
}
