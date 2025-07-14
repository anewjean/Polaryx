"use client";

import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Plus, CircleCheck, Mail, SquareUserRound, AtSign } from "lucide-react";
import clsx from "clsx";
import { Member } from "@/apis/tabApi";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/store/profileStore";
import { useTabStore } from "@/store/tabStore";
import { useMyUserStore } from "@/store/myUserStore";
import { sendDirectMessage } from "@/apis/messageApi";

export interface UserMenuItemProps {
  user: Member;
  mode?: "default" | "addable";
  onClick?: () => void;
  isSelected?: boolean;
}

export function UserMenuItem({
  user,
  mode = "default",
  onClick,
  isSelected,
}: UserMenuItemProps) {
  // URL에서 workspaceId 추출
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  // 프로필
  const openProfile = useProfileStore((s) => s.openWithId);
  const refreshTabs = useTabStore((s) => s.refreshTabs);

  // 현재 유저 ID 상태 관리
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
    <SidebarMenuItem key={user.user_id}>
      <SidebarMenuButton
        className={clsx(
          "py-8 px-4 hover:bg-gray-200 flex justify-between items-center rounded-none",
          {
            "cursor-pointer": !!onClick,
          },
        )}
        onClick={onClick}
      >
        {/* 공통: 프로필 + 닉네임 + 역할 */}
        <div className="flex flex-row w-full justify-between items-center">
          <div className="flex items-end gap-2">
            <img
              src={user.image || "/user_default.png"}
              alt={user.nickname}
              className="w-[28px] aspect-square bg-gray-400 rounded-md object-cover"
            />
            <span className="text-lg font-bold text-gray-800 truncate">
              {user.nickname}
            </span>
            <span className="text-sm font-bold text-gray-400 truncate">
              {user.role}
            </span>
          </div>

          {/* default: DM 버튼 + Profile 버튼 */}
          {mode === "default" && (
            <div className="flex flex-row items-center gap-2 text-gray-400">
              <Button
                onClick={() => {
                  if (userId) {
                    const uniqueUserIds = new Set([userId, user.user_id]);
                    createDM(Array.from(uniqueUserIds), userId);
                  }
                }}
                variant="ghost"
                size="icon"
              >
                <AtSign className="size-6 aspect-square text-gray-400 hover:text-gray-600" />
              </Button>
              <Button
                onClick={() => openProfile(user.user_id)}
                variant="ghost"
                size="icon"
              >
                <SquareUserRound className="size-6.5 aspect-square text-gray-400 hover:text-gray-600" />
              </Button>
            </div>
          )}

          {/* possibleMember: Add 버튼 + Added 상태 추가 표시 */}
          {mode === "addable" && !isSelected && (
            <div className="flex items-center gap-1 text-gray-400">
              <Plus className="size-4 aspect-square" />
              <span className="font-bold">ADD</span>
            </div>
          )}
          {mode === "addable" && isSelected && (
            <div className="flex items-center gap-1 text-gray-400">
              <CircleCheck className="size-4 aspect-square text-green-500" />
              <span className="font-bold text-green-500">ADDED</span>
            </div>
          )}
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
