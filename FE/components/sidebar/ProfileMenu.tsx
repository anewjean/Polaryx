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
import { UserRoundCog, LogOut } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useProfileStore } from "@/store/profileStore";
import { useState } from "react";

interface ProfileMenuProps {
  logout: () => void;
  router: AppRouterInstance;
}

export function ProfileMenu({ logout, router }: ProfileMenuProps) {
  const openProfile = useProfileStore((s) => s.openWithId);
  const [myUserId, setMyUserId] = useState<string | null>(null);

  // localStorage에서 직접 토큰을 읽어 userId를 설정
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      const decoded = jwtDecode<{ user_id: string }>(token);
      const myUserId = decoded.user_id;
      setMyUserId(myUserId);
      console.log("myUserId", myUserId);
    }
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <PopoverClose>
        <Button
          variant="ghost"
          className="flex flex-1 items-center justify-start px-4 py-4 rounded-none text-gray-200 text-lg"
          onClick={() => openProfile(myUserId!)}
        >
          <UserRoundCog />
          프로필
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
          className="flex flex-1 items-center justify-start px-4 py-4 rounded-none text-gray-200 text-lg"
        >
          <LogOut />
          로그아웃
        </Button>
      </PopoverClose>
    </div>
  );
}
