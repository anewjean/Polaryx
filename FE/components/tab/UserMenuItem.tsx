"use client";

import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Plus, CircleCheck, Mail, SquareUserRound, AtSign } from "lucide-react";
import clsx from "clsx";
import { Member } from "@/apis/tabApi";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "@/store/profileStore";
import { useCreateDM } from "@/hooks/createDM";

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
  // DM방 생성
  const createDM = useCreateDM();

  // 프로필
  const openProfile = useProfileStore((s) => s.openWithId);

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
              onClick={() => openProfile(user.user_id)}
              src={user.image || "/user_default.png"}
              alt={user.nickname}
              className="w-[28px] aspect-square bg-gray-400 rounded-md object-cover cursor-pointer"
            />
            <span
              onClick={() => openProfile(user.user_id)}
              className="text-lg font-bold text-gray-800 truncate cursor-pointer hover:underline"
            >
              {user.nickname}
            </span>
            <span className="text-sm font-bold text-gray-400 truncate">
              {user.role_name}
            </span>
          </div>

          {/* default: DM 버튼 + Profile 버튼 */}
          {mode === "default" && (
            <div className="flex flex-row items-center gap-2 text-gray-400">
              <Button
                onClick={() => createDM(user.user_id)}
                variant="ghost"
                size="icon"
                className="cursor-pointer"
              >
                <AtSign className="size-6 aspect-square text-gray-400 hover:text-gray-600" />
              </Button>
              <Button
                onClick={() => openProfile(user.user_id)}
                variant="ghost"
                size="icon"
                className="cursor-pointer"
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
