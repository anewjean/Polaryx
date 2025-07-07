"use client";

import { useEffect, useRef } from "react";
import { useMessageStore } from "@/store/messageStore";
import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  user_id: string;
}

export const WebSocketClient = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const { message, sendFlag, setSendFlag } = useMessageStore();

  useEffect(() => {
    {
      console.log("websocket_client");
    }
  });

  useEffect(() => {
    // 디버깅용
    console.log("new web sokcet");
    const socket = new WebSocket(`ws://localhost:8000/ws/1/1`);

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("websocket connected");
    };

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        useMessageStore.getState().appendMessage(msg);
      } catch {
        console.warn("Invalid message format: ", event.data);
      }
    };

    //   const [nickname, ...contentArr] = event.data.split(":");
    //   const content = contentArr.join(":");
    //   useMessageStore.getState().appendMessage({ id: undefined, nickname, content, created_at: undefined });
    // };

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
      const token = localStorage.getItem("access_token");

      if (!token) {
        console.log("토큰없당"); // 추후 수정
        return;
      }

      const { user_id } = jwtDecode<JWTPayload>(token);
      console.log("user_id");
      console.log(user_id);

      const payload = {
        sender_id: user_id,
        content: message,
      };

      socketRef.current.send(JSON.stringify(payload));
      setSendFlag(false); // 전송 후 플래그 초기화
    }
  }, [sendFlag, setSendFlag, message]);

  return <div>{/* 필요시 메시지 입력창/버튼 등 추가 */}</div>;
};
