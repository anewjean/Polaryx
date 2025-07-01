"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useMessageStore } from "@/store/messageStore";

export const WebSocketClient = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const [input, setInput] = useState("");

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

  const sendMessage = () => {
    socketRef.current?.send("client에서 보냄");
    setInput("");
  };

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
};
