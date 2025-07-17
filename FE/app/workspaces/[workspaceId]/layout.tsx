"use client";

import React, { useRef, useEffect } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  PanelOnCollapse,
  ImperativePanelHandle,
} from "@/components/ui/resizable";
import { useProfileStore } from "@/store/profileStore";
import { useRouter } from "next/navigation";

export default function WorkspaceIdLayout({
  children,
  sidebar,
  profile,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  profile: React.ReactNode;
}) {
  const router = useRouter();
  const profilePanelRef = useRef<ImperativePanelHandle>(null);

  // 프로필 표시를 위한 state 구독
  const { isOpen, setClose } = useProfileStore();

  // 진입 시 Access 토큰 확인
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      router.replace("/");
    }
  }, [router]);

  // 프로필 패널 제어
  useEffect(() => {
    const panel = profilePanelRef.current;
    if (panel) {
      if (isOpen) {
        panel.expand();
      } else {
        panel.collapse();
      }
    }
  }, [isOpen]);

  const onCollapse: PanelOnCollapse = () => {
    setClose();
  };

  return (
    <div className="flex flex-1 min-h-0">
      <div className="flex flex-1 flex-row min-h-0 w-full">
        <ResizablePanelGroup key="workspace-layout-group" direction="horizontal" className="flex-1 min-h-0">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <aside className="h-full">{sidebar}</aside>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={60} minSize={30}>
            <main className="h-full">{children}</main>
          </ResizablePanel>
          <ResizableHandle />
          {isOpen && (     
            <ResizablePanel
              ref={profilePanelRef}
              collapsible
              onCollapse={onCollapse}
              defaultSize={20}
              collapsedSize={0}
              minSize={15}
              maxSize={30}
              className="shadow-lg"
            >
              <aside className="h-full">{profile}</aside>
            </ResizablePanel>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
