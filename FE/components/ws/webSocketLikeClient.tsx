"use client";

import { useEffect, useRef } from "react";
import { useMessageStore } from "@/store/messageStore";
import { jwtDecode } from "jwt-decode";

const NEXT_PUBLIC_WS = process.env.NEXT_PUBLIC_WS;

interface JWTPayload {
  user_id: string;
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
  const { sendEmojiFlag, setSendEmojiFlag, pendingEmojiUpdates, clearPendingEmojiUpdates, addInFlightEmojiUpdates, updateEmojiCounts } = useMessageStore();

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
        console.log("WebSocket message received:", data);

        switch (data.type) {
          case 'emoji_update':
            updateEmojiCounts(data.messageId, data);
            break;       
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
  }, [workspaceId, tabId]); // 이 effect는 ID가 바뀔 때만 실행됩니다.

  // 2. '좋아요' 데이터 전송 감지 전용 useEffect
  useEffect(() => {
    if (
      sendEmojiFlag &&
      socketRef.current?.readyState === WebSocket.OPEN &&
      pendingEmojiUpdates.length > 0      
    ) {
      console.log("updated Emoji:", pendingEmojiUpdates);
      const token = localStorage.getItem("access_token");

      if (!token) {
        console.log("토큰없당"); // 추후 수정
        return;
      }

      const { user_id } = jwtDecode<JWTPayload>(token);

      // 각 업데이트 요청을 순회하며 서버에 전송합니다.
      pendingEmojiUpdates.forEach((update) => {
        const payload = {
          type: "emoji",
          messageId: update.msgId,
          userId: user_id,
          action: update.emojiAction, // 'like' 또는 'unlike' 문자열을 직접 사용합니다.
          emojiType: update.emojiType          
        };        
        socketRef.current?.send(JSON.stringify(payload));
      });

      // 서버 응답을 기다리는 큐로 이동
      addInFlightEmojiUpdates(pendingEmojiUpdates);
      
      // 작업 큐를 비우고 플래그를 리셋합니다.
      clearPendingEmojiUpdates();
      setSendEmojiFlag(false);
    }
  }, [sendEmojiFlag, pendingEmojiUpdates, clearPendingEmojiUpdates, addInFlightEmojiUpdates, setSendEmojiFlag]); // 의존성 배열을 업데이트합니다.

  return null;
}
