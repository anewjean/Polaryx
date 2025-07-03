import { useState, useRef } from "react";
import { MiniProfile } from "./MiniProfile";
import { useMessageStore } from "@/store/messageStore";
import { ChatEditButton } from "./chatEditButton";
import { EditInput } from "./EditInput";
import { updateMessage } from "@/apis/messages";
import { WebSocketClient } from "../ws/webSocketClient";
import { ShowDate } from "./ShowDate";
import { useMessageProfileStore } from "@/store/messageProfileStore";

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

  if (!profile) return null; // 프로필이 없을 때

  return (
    <>
      <WebSocketClient />
      <ShowDate timestamp={profile.timestamp} />
      <div className="flex p-[8px_20px] hover:bg-[#f8f8f8]">
        <div className="relative">
          <button
            className="w-[36px] mr-[8px] cursor-pointer"
            onMouseEnter={() => {
              hoverTimeout.current = setTimeout(() => setShowProfile(true), 800);
            }}
            onMouseLeave={() => {
              if (hoverTimeout.current !== null) {
                clearTimeout(hoverTimeout.current);
                hoverTimeout.current = null;
              }
              setShowProfile(false);
            }}
          >
            <img src="/profileTest.png" className="w-[36px] h-[36px] mt-1 rounded-md" />
            {showProfile && (
              <div className="absolute bottom-full left-0 z-19">
                <MiniProfile />
              </div>
            )}
          </button>
        </div>
        <div className="w-[100%] m-[-12px -8px -16px -16px] p-[8px 8px 8px 16px]">
          <div className="flex items-baseline space-x-1.5">
            <button className="text-m-bold cursor-pointer hover:underline">{messages[0].nickname}</button>
            <div className="text-xs chat-time-stamp">
              {profile
                ? new Date(profile.timestamp).toLocaleTimeString("ko-KR", {
                    hour: "numeric",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })
                : ""}
            </div>
          </div>
          <div className="text-m h-170 overflow-y-auto pr-2">
            {messages.map((msg) =>
              hiddenIdxs.includes(msg.id ?? 0) ? null : (
                <div
                  key={msg.id}
                  onMouseEnter={() => setHoverIdx(msg.id ?? 0)}
                  onMouseLeave={() => setHoverIdx(null)}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {editIdx === msg.id ? (
                    <EditInput
                      value={editValue}
                      onChange={setEditValue}
                      onSave={() => {
                        // updateMessage(i, { nickname: msg.nickname, content: editValue });
                        setEditIdx(null);
                      }}
                      onCancel={() => setEditIdx(null)}
                    />
                  ) : (
                    <>
                      {/* <div dangerouslySetInnerHTML={{ __html: msg }} /> */}
                      <p className={msg.nickname.startsWith("@") ? "text-m-bold chat-alarm" : ""} style={{ margin: 0 }}>
                        {msg.content}
                      </p>
                      <ChatEditButton
                        visible={hoverIdx === msg.id}
                        onClick={() => {
                          setEditIdx(msg.id ?? 0);
                          setEditValue(msg.content);
                        }}
                        onDelete={() => setHiddenIdxs((prev) => [...prev, msg.id ?? 0])}
                      />
                    </>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </>
  );
}
