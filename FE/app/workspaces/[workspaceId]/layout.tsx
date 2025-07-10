"use client";

import React from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useState, useEffect } from "react";

import { useProfileStore } from "@/store/profileStore";
import { useRouter } from "next/navigation";

export default function WorkspaceIdLayout({
  children,
  sidebar,
  profile,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  profile: React.ReactElement<{ width: number }>;
}) {
  const router = useRouter();
  const [sidebarWidth, setSidebarWidth] = useState(20);
  const [currentSidebarWidth, setCurrentSidebarWidth] = useState(20);
  const [profileWidth, setProfileWidth] = useState(15);

  // 프로필 표시를 위한 state 구독
  const { isOpen } = useProfileStore();

  // 진입 시 Access 토큰 확인
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      router.replace("/");
    }
  }, [router]);

  // 사이드바 너비가변경 시 defaultSize 업데이트
  useEffect(() => {
    setCurrentSidebarWidth(sidebarWidth);
  }, [sidebarWidth]);

  // 프로필 패널 크기 변경 시 상태 업데이트
  const handleLayout = (sizes: number[]) => {
    setSidebarWidth(sizes[0]);
    if (isOpen) {
      setProfileWidth(sizes[2]);
    }
  };

  // 렌더링 시 채널 너비를 직접 계산
  const channelWidth = isOpen ? 100 - currentSidebarWidth - profileWidth : 100 - currentSidebarWidth;

  return (
    <div className="flex flex-1 min-h-0">
      <div className="flex flex-1 flex-row min-h-0 w-full">
        <ResizablePanelGroup
          key="workspace-layout-group"
          direction="horizontal"
          className="flex-1 min-h-0"
          onLayout={handleLayout}
        >
          <ResizablePanel minSize={10} maxSize={30}>
            {/* 사이드바 영역: 너비값을 함께 전달 */}
            <aside className="h-full">
              {React.isValidElement(sidebar)
                ? React.cloneElement(sidebar as React.ReactElement<any>, { width: sidebarWidth })
                : sidebar}
            </aside>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel minSize={30}>
            {/* 탭 영역*/}
            <main className="h-full">{children}</main>
          </ResizablePanel>
          {/* 프로필이 열렸을 때만 렌더링 */}
          {isOpen && (
            <>
              <ResizableHandle />
              <ResizablePanel
                minSize={15}
                maxSize={30}
                style={{ boxShadow: "-8px 0 16px rgba(0, 0, 0, 0.1)" }}
              >
                <aside className="h-full">
                  {/* 프로필 영역 */}
                  {React.isValidElement(profile) ? React.cloneElement(profile, { width: profileWidth }) : profile}
                </aside>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
