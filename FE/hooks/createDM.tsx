import { useRouter } from "next/navigation";
import { useTabStore } from "@/store/tabStore";
import { useCallback } from "react";
import { sendDirectMessage } from "@/apis/messageApi";
import { useMyUserStore } from "@/store/myUserStore";
import { useParams } from "next/navigation";

// DM 생성 로직
export function useCreateDM() {
  const userId = useMyUserStore((s) => s.userId); // 로그인한 유저의 id
  const refreshTabs = useTabStore((s) => s.refreshTabs);
  // workspace id 가져오기
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  return useCallback(
    async (targetId: string) => {
      // DM 보낼 상대방을 인자로 받음
      if (!userId) return;
      const ids = Array.from(new Set([userId, targetId])); // 채팅 참가자들의 id 배열 (나 + 상대방)
      const res = await sendDirectMessage(workspaceId, ids, userId);
      refreshTabs(); // 탭 새로고침 상태 업데이트
      router.replace(`/workspaces/${workspaceId}/tabs/${res.tab_id}`);
    },
    [workspaceId, userId, refreshTabs, router],
  );
}