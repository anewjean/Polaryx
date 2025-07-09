"use client";

import { Member, postMemberList } from "@/apis/tabApi";
import { useState, useEffect } from "react";
import { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarMenu, SidebarFooter } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { MemberModal } from "./MemberModal";
import { UserMenuItem } from "@/components/tab/UserMenuItem";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { CircleCheck, Ban } from "lucide-react";

export interface possibleMembersProps {
  title: string;
  possibleMembers: Member[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  membersCount?: number;
}

export function PossibleMembersModal({
  title,
  possibleMembers,
  open,
  onOpenChange,
  membersCount,
}: possibleMembersProps) {
  // URL에서 workspaceId와 tabId 가져오기
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const tabId = params.tabId as string;

  // 참여 가능 멤버 명단 관리
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);

  // 모달이 닫힐 때 selectedMembers 초기화
  useEffect(() => {
    if (!open) {
      setSelectedMembers([]);
    }
  }, [open]);

  // 참여 가능 멤버 선택 핸들러
  const toggleMemberSelect = (member: Member) => {
    setSelectedMembers((prev) => {
      if (prev.some((m) => m.user_id === member.user_id)) {
        return prev.filter((m) => m.user_id !== member.user_id);
      } else {
        return [...prev, member];
      }
    });
  };

  // Invite 버튼 선택 시 동작 함수
  const inviteMembers = async () => {
    try {
      const result = await postMemberList(
        workspaceId,
        tabId,
        selectedMembers.map((member) => member.user_id),
      );
    } catch (error) {
      toast.error("초대에 실패했습니다", {
        icon: <Ban className="size-5" />,
      });
      return;
    }
    toast.success(`${selectedMembers.length}명이 초대되었습니다`, {
      icon: <CircleCheck className="size-5" />,
    });
    onOpenChange(false);
  };

  return (
    <MemberModal
      title={title}
      possibleMembers={possibleMembers}
      open={open}
      onOpenChange={onOpenChange}
      membersCount={membersCount}
    >
      {/* MemberModal 내용: 참여 가능 멤버 리스트 */}
      <div className="flex flex-col flex-grow overflow-y-auto gap-0">
        <SidebarProvider>
          <SidebarMenu>
            {possibleMembers.length === 0 && <h1 className="py-10 text-center">No possible members</h1>}
            {possibleMembers.map((member) => (
              <UserMenuItem
                key={member.user_id}
                user={member}
                mode="addable"
                onClick={() => toggleMemberSelect(member)}
                isSelected={selectedMembers.some((m) => m.user_id === member.user_id)}
              />
            ))}
          </SidebarMenu>
        </SidebarProvider>
      </div>
      <SidebarFooter className="flex-none">
        <Button className="w-full" onClick={inviteMembers}>
          Invite ({selectedMembers.length || 0})
        </Button>
      </SidebarFooter>
    </MemberModal>
  );
}
