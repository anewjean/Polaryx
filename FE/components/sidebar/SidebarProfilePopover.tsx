import React from "react";
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { UserRoundCog, LogOut } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface SidebarProfilePopoverProps {
  logout: () => void;
  router: AppRouterInstance;
}

export function SidebarProfilePopover({ logout, router }: SidebarProfilePopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="rounded-full p-2">
          <img src="/user.png" alt="User Profile" className="w-10 h-10 rounded-full" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="right" sideOffset={12} className="flex overflow-hidden bg-gray-700 rounded-md w-48">
        <div className="flex flex-1 flex-col">
          <PopoverClose>
            <Button
              variant="ghost"
              className="flex flex-1 items-center justify-start px-4 py-4 rounded-none text-gray-200 text-lg"
              onClick={() => {
                // 프로필 페이지로 이동하는 로직 (아직 구현되지 않음)
                console.log("프로필 페이지로 이동");
              }}
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
      </PopoverContent>
    </Popover>
  );
}
