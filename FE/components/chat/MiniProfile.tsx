import { HoverCardContent } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "@/store/profileStore";
import { useTabStore } from "@/store/tabStore";
import { sendDirectMessage } from "@/apis/messageApi";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMyUserStore } from "@/store/myUserStore";

interface MiniProfileProps {
  senderId: string;
  imgSrc: string;
  nickname: string;
}

export function MiniProfile({ senderId, imgSrc, nickname }: MiniProfileProps) {
  // URL에서 workspaceId 추출
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  // 프로필
  const openProfile = useProfileStore((s) => s.openWithId);
  const refreshTabs = useTabStore((s) => s.refreshTabs);

  // // 현재 유저 ID 상태 관리
  const userId = useMyUserStore((s) => s.userId);

  // DM 생성 이벤트 핸들러
  const createDM = async (userIds: string[], userId: string) => {
    try {
      const res = await sendDirectMessage(workspaceId, userIds, userId);
      console.log("DM 생성 응답:", res);
      refreshTabs(); // 탭 새로고침 상태 업데이트
      router.replace(`/workspaces/${workspaceId}/tabs/${res.tab_id}`);
    } catch (error) {
      console.error("DM 생성 중 오류:", error);
    }
  };

  return (
    <div>
      <HoverCardContent
        side="top"
        className="flex items-center HoverCardContent"
      >
        <div>
          <img
            src={imgSrc}
            className="w-[60px] h-[60px] rounded-lg bg-gray-400 mr-3 object-cover"
          />
        </div>
        <div>
          <div className="ml-0.5 text-m-bold">{nickname}</div>
          <div className="mt-1.5">
            {/* DM 버튼 */}
            <Button
              className="cursor-pointer"
              variant="outline"
              size="sm"
              onClick={() => {
                if (userId) {
                  const uniqueUserIds = new Set([userId, senderId]);
                  createDM(Array.from(uniqueUserIds), userId);
                }
              }}
            >
              <div className="text-s-bold">DM</div>
            </Button>

            {/* 프로필 버튼 */}
            <Button
              onClick={() => openProfile(senderId)}
              className="ml-1 cursor-pointer"
              variant="outline"
              size="sm"
            >
              <div className="text-s-bold">프로필</div>
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </div>
  );
}
