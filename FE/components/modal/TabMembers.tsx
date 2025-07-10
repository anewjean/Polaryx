"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { getTabInfo, getMemberList, getPossibleMemberList, Member } from "@/apis/tabApi";
import { useEffect, useState } from "react";
import { TabMembersModal } from "@/components/modal/TabMembersModal";
import { PossibleMembersModal } from "@/components/modal/PossibleMembersModal";
import { useTabInfoStore } from "@/store/tabStore";

export function TabMembers() {
  // 파라미터에서 workspaceId와 tabId 추출
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const tabId = params.tabId as string;



  // 멤버 리스트 상태 관리
  const [tabMembers, setTabMembers] = useState<Member[]>([]);
  const [possibleMembers, setPossibleMembers] = useState<Member[]>([]);

  // 멤버 확인 및 초대 모달 열림 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddModalOpenChange = (open: boolean) => {
    setIsAddModalOpen(open);
  };

  // 탭 정보 가져오기
  const fetchTabInfo = useTabInfoStore((state) => state.fetchTabInfo);
  const tabInfo = useTabInfoStore((state) => state.tabInfoCache[tabId]);

  useEffect(() => {
    if (workspaceId && tabId) {
      fetchTabInfo(workspaceId, tabId);
    }
  }, [workspaceId, tabId, fetchTabInfo]);

  // 참여 가능 멤버 목록 조회
  const handleAddMember = () => {
    if (workspaceId && tabId) {
      getPossibleMemberList(workspaceId, tabId).then(setPossibleMembers);
      setIsAddModalOpen(true);
      setIsModalOpen(false);
    }
  };

  const handleOpenMembersModal = () => {
    if (workspaceId && tabId) {
      getMemberList(workspaceId, tabId).then(setTabMembers);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <TabMembersModal
        trigger={
          <Button
            variant="ghost"
            size="icon"
            className="flex items-center gap-1 px-7 hover:bg-gray-200"
            onClick={handleOpenMembersModal}
          >
            <Users size={28} />
            <span>{tabInfo?.members_count}</span>
          </Button>
        }
        title={tabInfo?.tab_name || ""}
        tabMembers={tabMembers}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddClick={handleAddMember}
        membersCount={tabInfo?.members_count ?? undefined}
      />

      <PossibleMembersModal
        title={tabInfo?.tab_name || ""}
        possibleMembers={possibleMembers}
        open={isAddModalOpen}
        onOpenChange={handleAddModalOpenChange}
        membersCount={tabInfo?.members_count ?? undefined}
      />
    </>
  );
}
