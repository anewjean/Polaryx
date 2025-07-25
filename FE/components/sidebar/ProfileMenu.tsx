"use client";

import React, { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { UserRoundCog, LogOut, Settings } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useProfileStore } from "@/store/profileStore";
import { useMyUserStore } from "@/store/myUserStore";
import { useParams } from "next/navigation";

interface ProfileMenuProps {
  logout: () => void;
  router: AppRouterInstance;
}

export function ProfileMenu({ logout, router }: ProfileMenuProps) {
  // URL에서 workspaceId 추출
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const openProfile = useProfileStore((s) => s.openWithId);
  const myUserId = useMyUserStore((s) => s.userId);

  return (
    <div className="flex w-full h-43 flex-col">
      <div className="flex flex-col">
        <PopoverClose>
          <Button
            variant="ghost"
            className="flex flex-1 items-center justify-start px-4 py-3 rounded-md text-gray-300 text-lg font-semibold mx-1 mt-1"
            onClick={() => openProfile(myUserId!)}
          >
            <UserRoundCog className="size-7 border border-gray-400 text-gray-400 rounded-md p-1"/>
            <span className="ml-2">프로필</span>
          </Button>
        </PopoverClose>      
        <PopoverClose>
          <Button
            variant="ghost"
            className="flex flex-1 items-center justify-start px-4 py-3 rounded-md text-gray-300 text-lg font-semibold mx-1 mb-1"
            onClick={() => {
              router.push(`/workspaces/${workspaceId}/admin/users`);
            }}
          >
            <Settings className="size-7 border border-gray-400 text-gray-400 rounded-md p-1"/>
            <span className="ml-2">관리 메뉴</span>
          </Button>
        </PopoverClose>
        <hr className="border-gray-500" />
        <PopoverClose>
          <Button
            onClick={() => {
              logout();
              window.alert("로그아웃 되었습니다.");
              router.push("/");
            }}
            variant="ghost"
            className="flex flex-1 items-center justify-start px-4 py-3 rounded-md text-gray-300 text-lg font-semibold mx-1 m-1"
          >
            <LogOut className="size-7 border border-gray-400 text-gray-400 rounded-md p-1"/>
            <span className="ml-2">로그아웃</span>
          </Button>
        </PopoverClose>
      </div>
    </div>
  );
}
