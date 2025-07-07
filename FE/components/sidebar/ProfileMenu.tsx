"use client";

import React from "react";
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { UserRoundCog, LogOut } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useProfileStore } from "@/store/profileStore";

interface ProfileMenuProps {
  logout: () => void;
  router: AppRouterInstance;
}

export function ProfileMenu({ logout, router }: ProfileMenuProps) {
  const open = useProfileStore((s) => s.setOpen);

  return (
    <div className="flex flex-1 flex-col">
      <PopoverClose>
        <Button
          variant="ghost"
          className="flex flex-1 items-center justify-start px-4 py-4 rounded-none text-gray-200 text-lg"
          onClick={open}
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
