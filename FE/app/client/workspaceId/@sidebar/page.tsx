"use client";

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
import { Home, MessageSquare, Users, Settings } from "lucide-react";
import { School } from "lucide-react";
import { ChevronsUpDown } from "lucide-react";

type SidebarProps = {
  width: number;
};

export default function AppSidebar({ width }: SidebarProps) {
  const { workspaceId } = useParams();

  const navItems = [
    {
      label: "너비 조절 테스트",
      icon: Home,
      href: `/${workspaceId}`,
    },
    { label: "너비 조절 테스트", icon: MessageSquare, href: `/${workspaceId}/channels` },
    { label: "너비 조절 테스트", icon: Users, href: `/${workspaceId}/members` },
    { label: "너비 조절 테스트", icon: Settings, href: `/${workspaceId}/settings` },
  ];

  return (
    <SidebarProvider>
      <Sidebar collapsible="none" className="flex flex-1 min-h-0 min-w-0 flex-col p-1 bg-gray-800 text-gray-400">
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
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-200">워크스페이스</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild className="hover:bg-[rgba(255,255,255,0.10)]">
                      <a href={item.href} className="flex items-center px-2 py-1 space-x-2 rounded">
                        <item.icon className="text-gray-400" size={16} />
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
