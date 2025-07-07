"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { getTabInfo, Tab } from "@/apis/tabApi";
import { useEffect, useState } from "react";
import { MemberModal } from "@/components/modal/MemberModal";

export function TabMembers() {
  // 파라미터에서 workspaceId와 tabId 추출
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const tabId = params.tabId as string;

  // 멤버 확인 및 초대 모달 열림 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 탭 정보 상태 관리
  const [tabInfo, setTabInfo] = useState<Tab | null>(null);

  // 멤버 확인 및 초대 모달 종료 핸들러
  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(false);
  };

  // 탭 정보 조회
  useEffect(() => {
    if (workspaceId && tabId) {
      const fetchTabInfo = async () => {
        try {
          const info = await getTabInfo(workspaceId, tabId);
          setTabInfo(info);
        } catch (error) {
          console.error("Failed to fetch tab info:", error);
        }
      };
      fetchTabInfo();
    }
  }, [workspaceId, tabId]);

  if (!tabInfo) {
    return <div>Loading...</div>; // 또는 스켈레톤 UI
  }

  return (
    <MemberModal
      title={tabInfo.tab_name}
      defaultOpen={false}
      open={isModalOpen}
      onOpenChange={handleModalOpenChange}
      trigger={
        <Button
          variant="ghost"
          size="icon"
          className="flex w-max items-center justify-center px-3 rounded-md hover:bg-gray-200"
        >
          <Users size={28} />
          <span>{tabInfo.members_count}</span>
        </Button>
      }
    >
      {/* MemberModal 내용: 멤버 리스트 */}
      <h1>Name</h1>
    </MemberModal>
  );
}
