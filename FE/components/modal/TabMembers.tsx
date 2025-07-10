"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { getTabInfo, getMemberList, getPossibleMemberList, Tab, Member } from "@/apis/tabApi";
import { useEffect, useState } from "react";
import { MemberModal } from "@/components/modal/MemberModal";
import { TabMembersModal } from "@/components/modal/TabMembersModal";
import { PossibleMembersModal } from "@/components/modal/PossibleMembersModal";
import { useTabInfoStore } from "@/store/tabStore";

export function TabMembers() {
  // 파라미터에서 workspaceId와 tabId 추출
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const tabId = params.tabId as string;

  // 탭 정보 캐시에서 가져오기 (무한 루프 방지를 위해 객체로 한 번에 구독)
  const tabInfoCache = useTabInfoStore((state) => state.tabInfoCache);
  const setTabInfo = useTabInfoStore((state) => state.setTabInfo);
  const tabInfo = tabInfoCache[tabId];

  // 멤버 리스트 상태 관리
  const [tabMembers, setTabMembers] = useState<Member[]>([]);
  const [possibleMembers, setPossibleMembers] = useState<Member[]>([]);

  // 멤버 확인 및 초대 모달 열림 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // 멤버 확인 및 초대 모달 종료 핸들러
  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(open);
  };
  const handleAddModalOpenChange = (open: boolean) => {
    setIsAddModalOpen(open);
  };

  // 탭 정보 조회
  useEffect(() => {
    if (workspaceId && tabId && !tabInfo) {
      getTabInfo(workspaceId, tabId)
        .then((info) => {
          setTabInfo(tabId, info); // 캐시에 정보 저장
        })
        .catch((e) => {
          console.log("탭 정보 조회 실패:", e);
        });
    }
  }, [workspaceId, tabId, tabInfo]);

  // 모달이 열릴 때 멤버 목록 조회
  useEffect(() => {
    if (isModalOpen && workspaceId && tabId) {
      getMemberList(workspaceId, tabId).then(setTabMembers);
      getPossibleMemberList(workspaceId, tabId).then(setPossibleMembers);
    }
  }, [isModalOpen, workspaceId, tabId]);

  // 참여 가능 멤버 목록 조회
  const handleAddMember = () => {
    if (workspaceId && tabId) {
      getPossibleMemberList(workspaceId, tabId).then(setPossibleMembers);
      setIsAddModalOpen(true);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <TabMembersModal
        trigger={
          <Button variant="ghost" size="icon" className="flex items-center gap-1 px-7 hover:bg-gray-200">
            <Users size={28} />
            <span>{tabInfo?.members_count}</span>
          </Button>
        }
        title={tabInfo?.tab_name || ""}
        tabMembers={tabMembers}
        open={isModalOpen}
        onOpenChange={handleModalOpenChange}
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
