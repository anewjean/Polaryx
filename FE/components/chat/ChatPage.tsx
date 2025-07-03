import { useState, useRef } from "react";
import { MiniProfile } from "./MiniProfile";
import { useMessageStore } from "@/store/messageStore";
import { ChatEditButton } from "./chatEditButton";
import { EditInput } from "./EditInput";
import { updateMessage } from "@/apis/messages";
import { WebSocketClient } from "../ws/webSocketClient";
import { ShowDate } from "./ShowDate";
import { useMessageProfileStore } from "@/store/messageProfileStore";
import { useDeleteMessage } from "@/hooks/useFetchMessages";
import { ChatProfile } from "./ChatProfile";

// 채팅방 내 채팅
export function ChatPage() {
  const messages = useMessageStore((state) => state.messages);
  const updateMessage = useMessageStore((state) => state.updateMessage);
  const profile = useMessageProfileStore((state) => state.profiles[0]);
  const [showProfile, setShowProfile] = useState(false);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [hiddenIdxs, setHiddenIdxs] = useState<number[]>([]);
  const { handleDelete, loading, error } = useDeleteMessage();

  if (!profile) return null; // 프로필이 없을 때

  return (
    <>
      <WebSocketClient />
      <ShowDate timestamp={profile.timestamp} />
      <div className="flex p-[8px_20px] hover:bg-[#f8f8f8]">
        <div className="w-[100%] m-[-12px -8px -16px -16px] p-[8px 8px 8px 16px]">
          <div className="text-m h-170 overflow-y-auto pr-2">
            {messages.map((msg) => (
              <ChatProfile
                key={msg.id}
                imgSrc="/profileTest.png"
                nickname={msg.nickname}
                time={
                  msg.created_at
                    ? new Date(msg.created_at).toLocaleTimeString("ko-KR", {
                        hour: "numeric",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })
                    : ""
                }
                content={msg.content}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
