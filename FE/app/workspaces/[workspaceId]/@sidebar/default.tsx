"use client";

import { useParams } from "next/navigation";
import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSectionStore } from "@/store/sidebarStore";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/store/profileStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ProfileMenu } from "@/components/sidebar/ProfileMenu";
import { DialogModal } from "@/components/modal/DialogModal";
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
import { Megaphone, Landmark, Users, Mail, School, ChevronRightIcon, ChevronDownIcon, Plus } from "lucide-react";
import { logout } from "@/apis/logout";
import { createTab, getTabList, Tab, checkTabName } from "@/apis/tabApi";
import { getWorkspaceName, workspace } from "@/apis/workspaceApi";
import { set } from "date-fns";

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

  // 탭 생성 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setTabName("");
    }
  };

  // 탭 생성 시 탭명 상태 관리
  const [tabName, setTabName] = useState("");

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

  // 탭 추가 시 재 렌더링 후 해당 탭으로 이동
  async function handleAddTab(sectionId: string, tabName: string) {
    try {
      const availableTabName = await checkTabName(workspaceId, sectionId, tabName);
      if (!availableTabName) {
        alert("이미 존재하는 탭명입니다.");
        return;
      }
      const newTab = await createTab(workspaceId, sectionId, tabName);
      setTabList([...tabList, newTab]);
      setIsModalOpen(false);
      setTabName("");
      router.push(`/workspaces/${workspaceId}/tabs/${newTab.tabId}`);
    } catch (error) {
      console.error(error);
      alert("탭 생성에 실패했습니다.");
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
              <SidebarGroupLabel className="flex flex-row items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex size-4 p-3 text-gray-200"
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
                            className="flex items-center px-2 py-1 space-x-2 rounded-sm flex-1 min-w-0"
                            onClick={() => router.push(`/workspaces/${workspaceInfo?.workspace_id}/tabs/${tab.tabId}`)}
                          >
                            <span className="truncate">{tab.tabName}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    {/* 탭 추가 모달 팝업 내용 */}
                    <DialogModal
                      title="Create a Tab"
                      defaultOpen={false}
                      open={isModalOpen}
                      onOpenChange={handleModalOpenChange}
                      trigger={
                        <SidebarMenuItem>
                          <SidebarMenuButton className="flex items-center px-2 py-1 space-x-2 flex-1 min-w-0">
                            <span className="flex flex-row gap-2 items-center truncate">
                              <Plus size={18} className="bg-gray-700 rounded-sm" />
                              Add Tab
                            </span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      }
                    >
                      {/* DialogModal 내용: 프로필 편집 폼 */}
                      <div className="flex flex-col gap-2">
                        <h1>Name</h1>
                        <Input
                          type="text"
                          placeholder="Please enter the name of the tab."
                          value={tabName}
                          onChange={(e) => setTabName(e.target.value)}
                        />
                        <div className="flex flex-1 flex-row mt-6 gap-3">
                          <Button 
                            variant="secondary"
                            onClick={() => handleModalOpenChange(false)}
                            className="flex flex-1">
                            Cancel
                          </Button>
                          <Button
                            variant="default"
                            onClick={() => handleAddTab(section.id, tabName)}
                            disabled={tabName.trim() === ""}
                            className="flex flex-1">
                            Create
                          </Button>
                        </div>
                      </div>
                    </DialogModal>
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
