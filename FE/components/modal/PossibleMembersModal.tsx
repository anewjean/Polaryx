"use client";

import { Member } from "@/apis/tabApi";
import { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarMenu } from "@/components/ui/sidebar";
import { MemberModal } from "./MemberModal";
import { UserMenuItem } from "@/components/tab/UserMenuItem";

export interface possibleMembersProps {
  title: string;
  possibleMembers: Member[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PossibleMembersModal({ title, possibleMembers, open, onOpenChange }: possibleMembersProps) {
  return (
    <MemberModal title={title} possibleMembers={possibleMembers} open={open} onOpenChange={onOpenChange}>
      {/* MemberModal 내용: 참여 가능 멤버 리스트 */}
      <div className="flex flex-col overflow-y-auto gap-0">
        <Separator />
        <SidebarProvider>
          <SidebarMenu>
            {possibleMembers.length === 0 && <h1 className="py-10 text-center">No possible members</h1>}
            {possibleMembers.map((member) => (
              <UserMenuItem key={member.user_id} user={member} mode="addable" />
            ))}
          </SidebarMenu>
        </SidebarProvider>
      </div>
    </MemberModal>
  );
}
