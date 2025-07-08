"use client";

import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Plus, CircleCheck } from "lucide-react";
import clsx from "clsx";
import { Member } from "@/apis/tabApi";

export interface UserMenuItemProps {
  user: Member;
  mode?: "default" | "addable";
  onClick?: () => void;
  isSelected?: boolean;
}

export function UserMenuItem({ user, mode = "default", onClick, isSelected }: UserMenuItemProps) {
  return (
    <SidebarMenuItem key={user.user_id}>
      <SidebarMenuButton
        className={clsx("py-8 px-4 hover:bg-gray-200 flex justify-between items-center rounded-none", {
          "cursor-pointer": !!onClick,
        })}
        onClick={onClick}
      >
        {/* 공통: 프로필 + 닉네임 + 역할 */}
        <div className="flex flex-row w-full justify-between items-center">
          <div className="flex items-end gap-2">
            <img
              src={user.image || "/user_default.png"}
              alt={user.nickname}
              className="w-[28px] aspect-square bg-gray-400 rounded-md"
            />
            <span className="text-lg font-bold text-gray-800 truncate">{user.nickname}</span>
            <span className="text-sm font-bold text-gray-400 truncate">{user.role}</span>
          </div>

          {/* possibleMember: Add 버튼 + Added 상태 추가 표시 */}
          {mode === "addable" && !isSelected && (
            <div className="flex items-center gap-1 text-gray-400">
              <Plus className="size-4 aspect-square" />
              <span>Add</span>
            </div>
          )}
          {mode === "addable" && isSelected && (
            <div className="flex items-center gap-1 text-gray-400">
              <CircleCheck className="size-4 aspect-square text-green-500" />
              <span className="text-green-500">Added</span>
            </div>
          )}
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
