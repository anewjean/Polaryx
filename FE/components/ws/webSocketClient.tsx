"use client";

const BASE = process.env.NEXT_PUBLIC_BASE;
const NEXT_PUBLIC_WS = process.env.NEXT_PUBLIC_WS;


import { useEffect, useRef } from "react";
import { useMessageStore } from "@/store/messageStore";
import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  user_id: string;
}

export const WebSocketClient = ({
  workspaceId,
  tabId,
}: {
  workspaceId: string;
  tabId: string;
}) => {
  const socketRef = useRef<WebSocket | null>(null);
  const { message, sendFlag, setSendFlag, fileUrl } = useMessageStore();

  useEffect(() => {
    {
      console.log("websocket_client");
    }
  });

  useEffect(() => {
    console.log("new web sokcet");
    const socket = new WebSocket(
      `${NEXT_PUBLIC_WS}/api/ws/${workspaceId}/${tabId}`,
    );

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("websocket connected");
    };

    socket.onmessage = (event) => {
      try {
        const rawMsg = JSON.parse(event.data);

        // file_url을 fileUrl로 변환하고 원본 제거
        const { file_url, ...msgWithoutFileUrl } = rawMsg;
        const msg = {
          ...msgWithoutFileUrl,
          fileUrl: file_url, // file_url -> fileUrl로 변환
          senderId: rawMsg.sender_id,
          msgId: rawMsg.message_id,
        };

        useMessageStore.getState().appendMessage(msg);

    //     if (Notification.permission === "granted") {
    //       new Notification("새 메시지 도착", {
    //         body: msg.content || "파일이 전송되었습니다.",
    //         icon: "/icon.png",
    //     });
    // }

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
  }, [workspaceId, tabId]);

  // 메시지 전송 감지
  useEffect(() => {
    if (
      sendFlag &&
      message &&
      socketRef.current?.readyState === WebSocket.OPEN
    ) {
      const token = localStorage.getItem("access_token");

      if (!token) {
        console.log("토큰없당"); // 추후 수정
        return;
      }

      const { user_id } = jwtDecode<JWTPayload>(token);

      const payload = {
        sender_id: user_id,
        content: message,
        file_url: fileUrl,
      };

      useMessageStore.getState().setFileUrl(null);
      socketRef.current.send(JSON.stringify(payload));
      setSendFlag(false); // 전송 후 플래그 초기화
    }
  }, [sendFlag, message, fileUrl, setSendFlag]);

  return <div>{/* 필요시 메시지 입력창/버튼 등 추가 */}</div>;
};