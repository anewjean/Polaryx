"use client";

import { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import {
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { MemberModal } from "./MemberModal";
import { UserMenuItem } from "@/components/tab/UserMenuItem";
import { UserRoundPlus } from "lucide-react";
import { Member } from "@/apis/tabApi";

export interface TabMembersModalProps {
  trigger: ReactNode;
  title: string;
  tabMembers: Member[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddClick: () => void;
  membersCount?: number;
}

export function TabMembersModal({
  trigger,
  title,
  tabMembers,
  open,
  onOpenChange,
  onAddClick,
  membersCount,
}: TabMembersModalProps) {
  return (
    <MemberModal
      trigger={trigger}
      title={title}
      open={open}
      onOpenChange={onOpenChange}
      membersCount={membersCount}
    >
      <div className="flex flex-col overflow-y-auto gap-0">
        <SidebarProvider>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="py-8 px-4 hover:bg-gray-200 rounded-none">
                <button
                  onClick={onAddClick}
                  className="flex flex-row justify-center items-center gap-2 cursor-pointer"
                >
                  <UserRoundPlus
                    size={28}
                    className="w-[28px] aspect-square bg-gray-400 text-white rounded-md"
                  />
                  <span className="text-lg font-bold text-gray-800 truncate">
                    Add Member
                  </span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {tabMembers.map((member) => (
              <UserMenuItem key={member.user_id} user={member} mode="default" />
            ))}
          </SidebarMenu>
        </SidebarProvider>
      </div>
    </MemberModal>
  );
}
