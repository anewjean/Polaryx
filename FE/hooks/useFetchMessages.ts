import { useEffect } from "react";
import { getMessages } from "@/apis/messages";
import { useMessageStore } from "@/store/messageStore";

export function useFetchMessages(workspaceId: string, tabId: string) {
  const setMessages = useMessageStore((state) => state.setMessages);

  useEffect(() => {
    async function fetch() {
      const res = await getMessages(workspaceId, tabId);
      //   setMessages(res.messages); // 서버 응답 구조에 따라
      const messages = res.messages.map((msg: any) => ({
        id: msg.id,
        nickname: msg.nickname,
        content: msg.content,
        created_at: msg.created_at,
      }));
      console.log(messages);
      setMessages(messages);
    }
    fetch();
  }, [workspaceId, tabId, setMessages]);
}
