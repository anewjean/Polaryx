import { useCallback, useEffect, useState } from "react";
import { deleteMessage, getMessages } from "@/apis/messages";
import { useMessageStore } from "@/store/messageStore";

export function useFetchMessages(workspaceId: string, tabId: string) {
  const setMessages = useMessageStore((state) => state.setMessages);
  
  useEffect(() => {
    async function fetch() {
      const res = await getMessages(workspaceId, tabId);
      //   setMessages(res.messages); // 서버 응답 구조에 따라
      console.log("here")
      const messages = res.messages.map((msg: any) => ({
        senderId: msg.sender_id,
        msgId: msg.id,
        nickname: msg.nickname,
        content: msg.content,
        image: msg.image,
        createdAt: msg.created_at,
      }));
      console.log(messages);
      setMessages(messages);
    }
    fetch();
  }, [workspaceId, tabId, setMessages]);
}

export function useDeleteMessage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messages = useMessageStore((state) => state.messages);
  const setMessages = useMessageStore((state) => state.setMessages);

  const handleDelete = useCallback(
    async (workspaceId: string, tabId: string, messageId: number) => {
      setLoading(true);
      setError(null);
      try {
        await deleteMessage(workspaceId, tabId, messageId);
        setMessages(messages.filter((msg) => msg.msgId !== messageId));
      } catch (e: any) {
        setError("삭제에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    },
    [messages, setMessages],
  );

  return { handleDelete, loading, error };
}
