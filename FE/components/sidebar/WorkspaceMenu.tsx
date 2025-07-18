"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/apis/logout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Gamepad2, Cog } from "lucide-react";
import { getUserWorkspaces, workspace } from "@/apis/workspaceApi";

export interface WorkspaceMenuProps {
  workspaceId: string;
  userId: string;
  trigger: React.ReactNode;
  onWorkspaceOpenChange: (open: boolean) => void;
}

export function WorkspaceMenu({
  workspaceId,
  userId,
  trigger,
  onWorkspaceOpenChange,
}: WorkspaceMenuProps) {
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<workspace[]>([]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // 드롭다운이 열릴 때만 API 호출
  const handleOpenChange = async (open: boolean) => {
    onWorkspaceOpenChange(open);
    if (open && userId && workspaceId) {
      try {
        const userWorkspaces = await getUserWorkspaces(userId, workspaceId);
        setWorkspaces(userWorkspaces);
        console.log("userWorkspaces", userWorkspaces); // note : delete
      } catch (error) {
        console.error("워크스페이스 이름 조회 실패", error);
      }
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger
        asChild
        className="w-full flex justify-between items-center cursor-pointer"
      >
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-gray-700 w-64 text-gray-200 border-none"
        align="start"
        side="right"
        sideOffset={24}
        alignOffset={-12}
      >
        <DropdownMenuLabel className="text-gray-400 font-semibold">
          Programs
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {workspaces.map((workspace) => (
            <DropdownMenuItem
              asChild
              className="hover:bg-gray-600 focus:bg-gray-600"
              key={workspace.workspace_id}
              onClick={() =>
                router.push(`/workspaces/${workspace.workspace_id}/tabs/1`)
              }
            >
              <div className="flex flex-row items-center gap-3 hover:bg-gray-600 rounded-md py-3 px-3">
                <Gamepad2 className="size-7 border border-gray-400 text-gray-400 rounded-md p-1" />
                <span className="text-lg font-semibold text-gray-300">
                  {workspace.workspace_name}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
          {/* <DropdownMenuItem
            asChild
            className="hover:bg-gray-600 focus:bg-gray-600"
            onClick={() =>
              router.push(`/workspaces/${workspaceId}/admin/users`)
            }
          >
            <div className="flex flex-row items-center gap-3 hover:bg-gray-600 rounded-md py-3 px-3">
              <Cog className="size-7 border border-gray-400 text-gray-400 rounded-md p-1" />
              <span className="text-lg font-semibold text-gray-300">
                게임 테크랩
              </span>
            </div>
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-gray-600" />
        <DropdownMenuItem
          asChild
          className="hover:bg-gray-600 focus:bg-gray-600"
          onClick={handleLogout}
        >
          <div className="flex flex-row items-center gap-3 hover:bg-gray-600 rounded-md py-3 px-3">
            <Plus className="size-7 border border-gray-400 text-gray-400 rounded-md p-1" />
            <span className="text-lg font-semibold text-gray-300">
              Add Program
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
