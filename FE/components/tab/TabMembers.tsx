"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Users, UserRoundPlus } from "lucide-react";
import { getTabInfo, getMemberList, getPossibleMemberList, Tab, Member } from "@/apis/tabApi";
import { useEffect, useState } from "react";
import { MemberModal } from "@/components/modal/MemberModal";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

export function TabMembers() {
  // 파라미터에서 workspaceId와 tabId 추출
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const tabId = params.tabId as string;

  // 멤버 리스트 상태 관리
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [tabMembers, setTabMembers] = useState<Member[]>([]);
  const [possibleMembers, setPossibleMembers] = useState<Member[]>([]);

  // 멤버 확인 및 초대 모달 열림 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 탭 정보 상태 관리
  const [tabInfo, setTabInfo] = useState<Tab | null>(null);

  // 멤버 확인 및 초대 모달 종료 핸들러
  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(open);
  };

  // 탭 정보 및 멤버 조회
  useEffect(() => {
    if (workspaceId && tabId) {
      // 탭 정보 조회
      getTabInfo(workspaceId, tabId)
        .then(setTabInfo)
        .catch((error) => console.error("Failed to fetch tab info:", error));

      // 탭 멤버 목록 조회
      getMemberList(workspaceId, tabId)
        .then(setTabMembers)
        .catch((error) => console.error("Failed to fetch tab members:", error));

      // 참여 가능 멤버 목록 조회
      // getPossibleMemberList(workspaceId, tabId)
      //   .then(setPossibleMembers)
      //   .catch((error) => console.error("Failed to fetch possible members:", error));
    }
  }, [workspaceId, tabId]);

  /////////////////////////////////////////setSelectedMember에 poosiblemembers와 tabmembers 매핑
  // 멤버 클릭 시 호출: selectedMember 세팅 + 모달 열기
  const openMemberModal = (member: Member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  // 모달 닫힐 때 호출: 상태 초기화
  const closeMemberModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  return (
    <MemberModal
      title={tabInfo?.tab_name}
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
          <span>{tabInfo?.members_count}</span>
        </Button>
      }
    >
      {/* MemberModal 내용: 멤버 리스트 */}
      <div className="flex flex-col overflow-y-auto gap-0">
        <Separator />
        <SidebarProvider>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="py-8 px-4 hover:bg-gray-200 rounded-none">
                <div className="flex flex-row justify-start items-center gap-3">
                  <UserRoundPlus size={28} className="w-[28px] aspect-square bg-gray-400 text-white rounded-md" />
                  <span className="text-md font-bold text-gray-800 truncate">Add Member</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {tabMembers.map((member) => (
              <SidebarMenuItem key={member.user_id}>
                <SidebarMenuButton className="py-8 px-4 hover:bg-gray-200 rounded-none">
                  <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row justify-start gap-3">
                      <img
                        src={member?.image || "/user_default.png"}
                        alt="profile_image"
                        className="w-[28px] aspect-square bg-gray-400 rounded-md overflow-hidden"
                      />
                      <span className="text-lg font-bold text-gray-800 truncate">{member?.nickname}</span>
                    </div>
                    <span className="flex justify-start text-sm font-normal text-gray-600 truncate">
                      {member?.role}
                    </span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarProvider>
      </div>
    </MemberModal>
  );
}
