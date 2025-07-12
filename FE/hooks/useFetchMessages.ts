import { useCallback, useEffect, useState } from "react";
import { deleteMessage, getMessages } from "@/apis/messageApi";
import { useMessageStore } from "@/store/messageStore";

export function useFetchMessages(workspaceId: string, tabId: string) {
  const setMessages = useMessageStore((state) => state.setMessages);

  useEffect(() => {
    async function fetch() {
      if (!workspaceId || !tabId) return;
      try {
        const res = await getMessages(workspaceId, tabId);
        const messages = res.messages.map((msg: any) => ({
          senderId: msg.senderId,
          msgId: msg.id,
          nickname: msg.nickname,
          content: msg.content,
          image: msg.image,
          createdAt: msg.createdAt,
          isUpdated: msg.isUpdated,
          fileUrl: msg.fileUrl,
        }));
        setMessages(messages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        setMessages([]);
      }
    }
    fetch();
  }, [workspaceId, tabId]);
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
