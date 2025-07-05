"use client";

import "@/app/globals.css";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/store/profileStore";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from "@/components/ui/popover";
import { SidebarProfilePopover } from "@/components/sidebar/SidebarProfilePopover";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Megaphone, Landmark, Users, UserRoundCog, LogOut, Mail, School, ChevronsUpDown } from "lucide-react";
import { logout } from "@/apis/logout";
import { getTabList, Tab } from "@/apis/tabApi";
import { getWorkspaceName } from "@/apis/workspaceApi";

type SidebarProps = {
  width: number;
};

export default async function AppSidebar({ width }: SidebarProps) {
  const open = useProfileStore((s) => s.setOpen);
  const router = useRouter();

  // 워크스페이스 이름 조회
  const workspaceInfo = await getWorkspaceName();

  // 참여중인 탭 리스트 조회
  const tabs: Tab[] = await getTabList();

  const sectionType = [
    { id: "announcements", label: "Announcements", icon: Megaphone },
    { id: "courses", label: "Courses", icon: Landmark },
    { id: "channels", label: "Channels", icon: Users },
    { id: "direct-messages", label: "Direct Messages", icon: Mail },
  ];

  return (
    <SidebarProvider>
      <Sidebar collapsible="none" className="flex flex-1 min-h-0 min-w-0 flex-col p-1 bg-gray-800 text-gray-400">
        {/* 사이드바 헤더 (mvp에서는 단순 정보 표시) */}
        <SidebarHeader>
          <div className="h-13 p-2">
            <div className="flex flex-row items-center w-full gap-2">
              {/* 아이콘 */}
              <div className="bg-blue-600 rounded-lg p-2 flex items-center justify-center">
                <School size={20} className="text-white" />
              </div>
              {/* 워크스페이스 정보 */}
              <div className="flex flex-col overflow-hidden" style={{ width }}>
                <span className="text-md font-bold text-gray-200 truncate">{workspaceInfo.name}</span>
                <span className="text-xs text-gray-400 truncate">Welcome to {workspaceInfo.name}</span>
              </div>
            </div>
          </div>
        </SidebarHeader>
        {/* 사이드바 컨텐츠 */}
        <SidebarContent className="flex flex-1 min-h-0 flex-col overflow-y-auto scrollbar-thin">
          {sectionType.map((section) => (
            <SidebarGroup key={section.id} className="flex flex-col flex-none">
              <SidebarGroupLabel className="flex items-center gap-2">
                {React.createElement(section.icon, { size: 22, className: "text-gray-200" })}
                <span className="text-m font-bold text-gray-200 truncate">{section.label}</span>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="flex flex-col gap-0">
                  {tabs
                    .filter((tab) => tab.sectionId === section.id)
                    .map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton className="flex items-center px-2 py-1 space-x-2 rounded flex-1 min-w-0">
                          <a href={`/${workspaceInfo.id}/${item.id}`} className="truncate">
                            {item.name}
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        {/* 사이드바 푸터 */}
        <SidebarFooter>
          {/* 프로필 메뉴 호출 */}
          <Popover>
            <PopoverTrigger asChild>
              <SidebarMenuButton className="h-13 p-2">
                <div className="flex flex-row items-center w-full gap-2">
                  {/* 프로필 이미지 */}
                  <div className="bg-gray-600 rounded-lg p-2 size-9 flex items-center justify-center" />
                </div>
              </SidebarMenuButton>
            </PopoverTrigger>
            <PopoverContent side="right" sideOffset={12} className="flex overflow-hidden bg-gray-700 rounded-md w-48">
              <SidebarProfilePopover logout={logout} router={router} />
            </PopoverContent>
          </Popover>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
