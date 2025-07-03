"use client";

import { useEffect, useRef } from "react";
import { useMessageStore } from "@/store/messageStore";

export const WebSocketClient = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const { message, sendFlag, setSendFlag } = useMessageStore();

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/ws/1/1`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("websocket connected");
    };

    socket.onmessage = (event) => {
      const [nickname, ...contentArr] = event.data.split(":");
      const content = contentArr.join(":");
      useMessageStore.getState().appendMessage({ id: undefined, nickname, content, created_at: undefined });
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
      const data = {
        sender_id: "4e7e765b-5688-11f0-bb98-0242ac110002",
        content: message,
      };
      console.log(data.sender_id, data.content); //note: 나중에 지울 것
      socketRef.current.send(JSON.stringify(data));
      setSendFlag(false); // 전송 후 플래그 초기화
    }
  }, [sendFlag, setSendFlag, message]);

  return <div>{/* 필요시 메시지 입력창/버튼 등 추가 */}</div>;
};
