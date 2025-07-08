"use client";

const BASE = process.env.NEXT_PUBLIC_BASE

import { useEffect, useRef } from "react";
import { useMessageStore } from "@/store/messageStore";
import { jwtDecode } from "jwt-decode";
import { useParams } from "next/navigation";

interface JWTPayload {
  user_id: string;
}

export const WebSocketClient = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const { message, sendFlag, setSendFlag, fileUrl } = useMessageStore();
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const tabId = params.tabId as string;

  useEffect(() => {
    {
      console.log("websocket_client");
    }
  });

  useEffect(() => {
    // 디버깅용
    console.log("new web sokcet");
    const socket = new WebSocket(`ws://${BASE}/ws/${workspaceId}/${tabId}`);

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("websocket connected");
    };

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        console.log("get append message");
        console.log(msg.file_url);
        useMessageStore.getState().appendMessage(msg);
      } catch {
        console.warn("Invalid message format: ", event.data);
      }
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
      const token = localStorage.getItem("access_token");

      if (!token) {
        console.log("토큰없당"); // 추후 수정
        return;
      }

      const { user_id } = jwtDecode<JWTPayload>(token);
      console.log("user_id", user_id);

      const payload = {
        sender_id: user_id,
        // sender_id: "10CE9BCC5B0211F0A3ABE1F31FC066BF",
        content: message,
        file_url: fileUrl,
      };
      console.log("sender_id", payload.sender_id);
      console.log("content", payload.content);
      console.log("file_url", payload.file_url); //note: 나중에 지울 것
      useMessageStore.getState().setFileUrl(null);
      socketRef.current.send(JSON.stringify(payload));
      setSendFlag(false); // 전송 후 플래그 초기화
    }
  }, [sendFlag, setSendFlag, message]);

  return <div>{/* 필요시 메시지 입력창/버튼 등 추가 */}</div>;
};
