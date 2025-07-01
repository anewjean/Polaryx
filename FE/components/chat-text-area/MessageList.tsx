import { useMessageStore } from "@/store/messageStore";

export default function MessageList() {
  const messages = useMessageStore((state) => state.messages);

  return (
    <div>
      {messages.map((msg, idx) => (
        <div key={idx}>{msg}</div>
      ))}
    </div>
  );
}
