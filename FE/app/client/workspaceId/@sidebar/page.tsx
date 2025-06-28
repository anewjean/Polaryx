"use client";

import React from "react";

import { useParams } from "next/navigation";
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
import { Megaphone, Landmark, Users, Mail, ShieldUser } from "lucide-react";
import { School } from "lucide-react";
import { ChevronsUpDown } from "lucide-react";

type SidebarProps = {
  width: number;
};

export default function AppSidebar({ width }: SidebarProps) {
  const { workspaceId } = useParams();

  const sections = [
    { label: "Announcements", icon: Megaphone, href: `/${workspaceId}` },
    { label: "Courses", icon: Landmark, href: `/${workspaceId}/channels` },
    { label: "Channels", icon: Users, href: `/${workspaceId}/members` },
    { label: "Direct Messages", icon: Mail, href: `/${workspaceId}/settings` },
    { label: "Admin", icon: ShieldUser, href: `/${workspaceId}/settings` },
  ];

  const tabs = [
    { label: "너비 조절 테스트", href: `/${workspaceId}` },
    { label: "너비 조절 테스트", href: `/${workspaceId}/channels` },
    { label: "너비 조절 테스트", href: `/${workspaceId}/members` },
    { label: "너비 조절 테스트", href: `/${workspaceId}/settings` },
  ];

  return (
    <SidebarProvider>
      <Sidebar collapsible="none" className="flex flex-1 min-h-0 min-w-0 flex-col p-1 bg-gray-800 text-gray-400">
        {/* 사이드바 헤더 */}
        <SidebarHeader>
          <SidebarMenuButton className="h-13 p-2 hover:bg-[rgba(255,255,255,0.10)]">
            <div className="flex flex-row items-center w-full gap-2">
              {/* 아이콘 */}
              <div className="bg-blue-600 rounded-lg p-2 flex items-center justify-center">
                <School size={20} className="text-white" />
              </div>
              {/* 워크스페이스 정보 */}
              <div className="flex flex-col overflow-hidden" style={{ width }}>
                <span className="text-md font-bold text-gray-200 truncate">워크스페이스명</span>
                <span className="text-xs text-gray-400 truncate">교육기관명</span>
              </div>
            </div>
          </SidebarMenuButton>
        </SidebarHeader>
        {/* 사이드바 컨텐츠 */}
        <SidebarContent className="flex flex-1 min-h-0 flex-col overflow-y-auto space-y-4">
          {/* Announcements */}
          <SidebarGroup className="flex flex-col flex-none">
            <SidebarGroupLabel className="flex items-center gap-2">
              <Megaphone size={22} className="text-gray-200" />
              <span className="text-m font-bold text-gray-200 truncate">Announcements</span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="flex flex-col gap-0">
                {tabs.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild className="hover:bg-[rgba(255,255,255,0.10)]">
                      <a href={item.href} className="flex items-center px-2 py-1 space-x-2 rounded">
                        <span className="text-gray-400">{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {/* Courses */}
          <SidebarGroup className="flex flex-col flex-none">
            <SidebarGroupLabel className="flex items-center gap-2">
              <Landmark size={22} className="text-gray-200" />
              <span className="text-m font-bold text-gray-200 truncate">Courses</span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="flex flex-col gap-0">
                {tabs.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild className="hover:bg-[rgba(255,255,255,0.10)]">
                      <a href={item.href} className="flex items-center px-2 py-1 space-x-2 rounded">
                        <span className="text-gray-400">{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {/* Channels */}
          <SidebarGroup className="flex flex-col flex-none">
            <SidebarGroupLabel className="flex items-center gap-2">
              <Users size={22} className="text-gray-200" />
              <span className="text-m font-bold text-gray-200 truncate">Channels</span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="flex flex-col gap-0">
                {tabs.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild className="hover:bg-[rgba(255,255,255,0.10)]">
                      <a href={item.href} className="flex items-center px-2 py-1 space-x-2 rounded">
                        <span className="text-gray-400">{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {/* Direct Messages */}
          <SidebarGroup className="flex flex-col flex-none">
            <SidebarGroupLabel className="flex items-center gap-2">
              <Mail size={22} className="text-gray-200" />
              <span className="text-m font-bold text-gray-200 truncate">Direct Messages</span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="flex flex-col gap-0">
                {tabs.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild className="hover:bg-[rgba(255,255,255,0.10)]">
                      <a href={item.href} className="flex items-center px-2 py-1 space-x-2 rounded">
                        <span className="text-gray-400">{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenuButton className="h-13 p-2 hover:bg-[rgba(255,255,255,0.10)]">
            <div className="flex flex-row items-center w-full gap-2">
              {/* 프로필 이미지 */}
              <div className="bg-gray-600 rounded-lg p-2 size-9 flex items-center justify-center" />

              {/* 사용자 정보 */}
              <div className="flex flex-col overflow-hidden" style={{ width }}>
                <span className="text-md font-bold text-gray-200 truncate">사용자 이름</span>
                <span className="text-xs text-gray-400 truncate">user@email.com</span>
              </div>
            </div>
            {/* 사용자 메뉴 */}
            <div className="flex justify-center">
              <ChevronsUpDown className="text-gray-400" size={16} />
            </div>
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
