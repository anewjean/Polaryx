import { useMessageStore } from "@/store/messageStore";
import { WebSocketClient } from "../ws/webSocketClient";
import { ShowDate } from "./ShowDate";
import { useMessageProfileStore } from "@/store/messageProfileStore";
import { ChatProfile } from "./ChatProfile";

// 채팅방 내 채팅
export function ChatPage() {
  const messages = useMessageStore((state) => state.messages);
  const profile = useMessageProfileStore((state) => state.profiles[0]);

  return (
    <div className="flex flex-col h-full">
      <WebSocketClient />
      {profile && <ShowDate timestamp={profile.timestamp} />}

      <div className="flex-1 overflow-y-auto text-m h-170 overflow-y-auto pr-2 p-[8px_20px] w-[100%] m-[-12px -8px -16px -16px] p-[8px 8px 8px 16px]">
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
  );
}
