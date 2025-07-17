"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Group, postGroupList } from "@/apis/tabApi";
import { SidebarProvider, SidebarMenu, SidebarFooter } from "@/components/ui/sidebar";
import { UserMenuItem } from "@/components/tab/UserMenuItem";
import { toast } from "sonner";

export interface PossibleGroupsModalProps {
  workspaceId: string;
  tabId: string;
  possibleGroups: Group[];
  onBack: () => void;
  onInviteComplete: () => void;
}

export function PossibleGroupsModal({
  workspaceId,
  tabId,
  possibleGroups,
  onBack,
  onInviteComplete,
}: PossibleGroupsModalProps) {
  const [selectedGroups, setSelectedGroups] = useState<Group[]>([]);

  const toggleGroupSelect = (group: Group) => {
    setSelectedGroups((prev) =>
      prev.find((g) => g.group_id === group.group_id)
        ? prev.filter((g) => g.group_id !== group.group_id)
        : [...prev, group]
    );
  };

  const handleInvite = () => {
    const group_ids = selectedGroups.map((g) => String(g.group_id));
    postGroupList(workspaceId, tabId, group_ids)
      .then(() => {
        toast.success("그룹이 성공적으로 초대되었습니다.");
        onInviteComplete();
      })
      .catch((err: any) => {        
        toast.error("그룹 초대에 실패했습니다.");
      });
      
  };

  return (
    <SidebarProvider className="flex flex-col justify-between h-full">
      <div>
        <SidebarMenu className="flex-1 overflow-y-auto scrollbar-thin">
          {possibleGroups.length === 0 && (
            <div className="py-10 text-center">No possible groups</div>
          )}
          {possibleGroups.map((group) => (
            <UserMenuItem
              key={group.group_id}
              user={{
                user_id: String(group.group_id),
                nickname: group.group_name,
                role_name: `${group.group_members_count || 0} members`,
              }}
              mode="addableGroup"
              onClick={() => toggleGroupSelect(group)}
              isSelected={selectedGroups.some((g) => g.group_id === group.group_id)}
            />
          ))}
        </SidebarMenu>
      </div>
      <SidebarFooter className="p-4">
        <Button
          className="w-full"
          onClick={handleInvite}
          disabled={selectedGroups.length === 0}
        >
          Invite ({selectedGroups.length})
        </Button>
      </SidebarFooter>
    </SidebarProvider>
  );
}
