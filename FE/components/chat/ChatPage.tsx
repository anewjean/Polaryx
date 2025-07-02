import { useState, useRef } from "react";
import { MiniProfile } from "./MiniProfile";
import { useMessageStore } from "@/store/messageStore";
import { ChatEditButton } from "./chatEditButton";
import { EditInput } from "./EditInput";
import { updateMessage } from "@/apis/messages";

// 채팅방 내 채팅
export function ChatPage() {
  const messages = useMessageStore((state) => state.messages);
  const updateMessage = useMessageStore((state) => state.updateMessage);
  const [showProfile, setShowProfile] = useState(false);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [hiddenIdxs, setHiddenIdxs] = useState<number[]>([]);

  return (
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
          <button className="text-m-bold cursor-pointer hover:underline">Dongseok Lee (이동석)</button>
          <div className="text-xs chat-time-stamp">2025-06-19 10:00:00</div>
        </div>
        <div className="text-m">
          {messages.map((msg, i) =>
            hiddenIdxs.includes(i) ? null : (
              <div
                key={i}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
                style={{ display: "flex", alignItems: "center" }}
              >
                {editIdx === i ? (
                  <EditInput
                    value={editValue}
                    onChange={setEditValue}
                    onSave={() => {
                      updateMessage(i, editValue);
                      setEditIdx(null);
                    }}
                    onCancel={() => setEditIdx(null)}
                  />
                ) : (
                  <>
                    <p className={msg.startsWith("@") ? "text-m-bold chat-alarm" : ""} style={{ margin: 0 }}>
                      {msg}
                    </p>
                    <ChatEditButton
                      visible={hoverIdx === i}
                      onClick={() => {
                        setEditIdx(i);
                        setEditValue(msg);
                      }}
                      onDelete={() => setHiddenIdxs((prev) => [...prev, i])}
                    />
                  </>
                )}
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
