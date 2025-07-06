"use client";

import { useParams } from "next/navigation";
import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSectionStore } from "@/store/sidebarStore";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/store/profileStore";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ProfileMenu } from "@/components/sidebar/ProfileMenu";
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
import { Megaphone, Landmark, Users, Mail, School, ChevronRightIcon, ChevronDownIcon } from "lucide-react";
import { logout } from "@/apis/logout";
import { createTab, getTabList, Tab } from "@/apis/tabApi";
import { getWorkspaceName, workspace } from "@/apis/workspaceApi";

type SidebarProps = { width: number };

export default function AppSidebar({ width }: SidebarProps) {
  // URL에서 workspaceId, tabId 추출
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const tabId = params.tabId as string;

  const router = useRouter();

  // 워크스페이스 이름 상태 관리
  const [workspaceInfo, setWorkspaceInfo] = useState<workspace | null>(null);

  // 참여중인 탭 리스트 상태 관리
  const [tabList, setTabList] = useState<Tab[]>([]);

  // 탭 리스트 상태 최신화
  async function fetchTabList() {
    try {
      const tabList = await getTabList(workspaceId);
      setTabList(tabList);
    } catch (error) {
      console.error(error);
    }
  }

  // 워크스페이스 이름과 참여중인 탭 리스트 렌더링
  useEffect(() => {
    // 브라우저 환경에서만 실행
    if (typeof window !== "undefined") {
      (async () => {
        try {
          const workspaceInfo = await getWorkspaceName(workspaceId);
          setWorkspaceInfo(workspaceInfo);
          fetchTabList();
        } catch (error) {
          console.error("워크스페이스 정보 로딩 실패:", error);
          // 에러가 발생해도 UI는 표시
        }
      })();
    }
  }, []);

  // 탭 추가 시 재 렌더링
  async function handleAddTab(sectionId: string, tabName: string) {
    try {
      const newTab = await createTab(workspaceId, sectionId, tabName);
      setTabList([...tabList, newTab]);
    } catch (error) {
      console.error(error);
    }
  }

  // 섹션 열림/닫힘 상태 관리 (하나의 상태에 섹션을 개별적으로 관리)
  const { openSections, toggleSection } = useSectionStore();

  // 섹션 id별 섹션명과 아이콘
  const sectionType = [
    { id: "0", label: "Announcements", icon: Megaphone },
    { id: "1", label: "Courses", icon: Landmark },
    { id: "2", label: "Channels", icon: Users },
    { id: "3", label: "Direct Messages", icon: Mail },
  ];

  return (
    <SidebarProvider>
      <Sidebar collapsible="none" className="flex flex-col h-full w-full p-1 bg-gray-800 text-gray-400">
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
                <span className="text-md font-bold text-gray-200 truncate">{workspaceInfo?.workspace_name}</span>
                <span className="text-xs text-gray-400 truncate">Welcome to {workspaceInfo?.workspace_name}</span>
              </div>
            </div>
          </div>
        </SidebarHeader>
        {/* 사이드바 컨텐츠 */}
        <SidebarContent className="flex flex-1 flex-col overflow-y-auto scrollbar-thin">
          {sectionType.map((section) => (
            <SidebarGroup key={section.id} className="flex flex-col flex-none">
              <SidebarGroupLabel className="flex flex-row items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-4 text-gray-200"
                  onClick={() => toggleSection(section.id)}
                >
                  {openSections[section.id] ? <ChevronDownIcon /> : <ChevronRightIcon />}
                </Button>
                {React.createElement(section.icon, { size: 22, className: "text-gray-200" })}
                <span className="text-m font-bold text-gray-200 truncate">{section.label}</span>
              </SidebarGroupLabel>
              {openSections[section.id] && (
                <SidebarGroupContent>
                  <SidebarMenu className="flex flex-col pl-5 gap-0">
                    {tabList
                      .filter((tab) => tab.sectionId === section.id)
                      .map((tab) => (
                        <SidebarMenuItem key={tab.tabId}>
                          <SidebarMenuButton
                            asChild
                            className="flex items-center px-2 py-1 space-x-2 rounded flex-1 min-w-0"
                          >
                            <Link
                              href={`/workspaces/${workspaceInfo?.workspace_id}/tabs/${tab.tabId}`}
                              className="truncate"
                            >
                              {tab.tabName}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              )}
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
                  {/* 사용자 정보 */}
                  <div className="flex flex-col overflow-hidden" style={{ width }}>
                    <span className="text-md font-bold text-gray-200 truncate">사용자</span>
                    <span className="text-xs text-gray-400 truncate">편지 주세요</span>
                  </div>
                </div>
              </SidebarMenuButton>
            </PopoverTrigger>
            <PopoverContent side="right" sideOffset={12} className="flex overflow-hidden bg-gray-700 rounded-md w-48">
              <ProfileMenu logout={logout} router={router} />
            </PopoverContent>
          </Popover>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
