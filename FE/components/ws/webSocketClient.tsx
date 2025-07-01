"use client";

import { useEffect, useRef } from "react";
import { useMessageStore } from "@/store/messageStore";

export const WebSocketClient = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const { message, sendFlag, setSendFlag } = useMessageStore();

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/ws/1751338353730?channel_id=test1`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("websocket connected");
    };

    socket.onmessage = (event) => {
      console.log("Received message:", event.data);
    };

    socket.onerror = (error) => {
      console.error("❗ WebSocket 에러 발생", error);
      // UI에 에러 표시
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      socket.close();
    };
  }, []);

  // 메시지 전송 감지
  useEffect(() => {
    if (sendFlag && message && socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
      setSendFlag(false); // 전송 후 플래그 초기화
    }
  }, [sendFlag, setSendFlag, message]);

  return <div>{/* 필요시 메시지 입력창/버튼 등 추가 */}</div>;
};
