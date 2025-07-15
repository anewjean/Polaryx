"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { Group } from "@/apis/groupApi";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Member } from "@/apis/tabApi"
import { ActionMenu } from "@/components/Administration/GroupActions/ActionMenu"
 
export const groupColumns: ColumnDef<Group>[] = [
  {
    id: "actions",
    header: () => <div className="text-left pl-2">Actions</div>,
    size: 1,
    cell: ({ row }) => {
      const group = row.original;
      
      return (
        <div className="flex justify-start pl-2 w-full overflow-hidden">
          <ActionMenu 
            group={group} 
            onRefresh={() => {}} // 페이지에서 전달받을 예정
          />
        </div>
      );
    },
  },
  {
    accessorKey: "group_name",
    header: "Group",
    size: 1.5,
    cell: ({ row }) => {
      const group_name = row.getValue("group_name") as string;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-row truncate text-start w-full">
              {group_name}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" align="start" sideOffset={5}>
            <p>{group_name}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "role_name",
    header: "Role",
    size: 1.5, 
    cell: ({ row }) => {     
      const role = row.getValue("role_name") as string;

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-row truncate text-start w-full">
              {role}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" align="start" sideOffset={5}>
            <p>{role}</p>
          </TooltipContent>
        </Tooltip>
      );
    }
  },
  {
    accessorKey: "members",
    id: "members_count",
    header: "Members Count",
    size: 1.5,
    cell: ({ row }) => {     
      const members = row.getValue("members") as Member[];
      const membersCount = members ? members.length : 0;

      return (
        <div className="flex flex-row truncate pl-10 w-full">
          {membersCount}
        </div>
      );
    }
  },
  {
    accessorKey: "members",
    id: "members_list",
    header: "Members",
    size: 4.5,
    cell: ({ row }) => {     
      const members = row.getValue("members") as Member[];      
      const nicknames = members ? members.map(member => member.nickname) : [];

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-row truncate justify-start w-full">
              {nicknames.join(", ")}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" align="start" sideOffset={5}>
            <p>{nicknames.join(", ")}</p>
          </TooltipContent>
        </Tooltip>
      );
    }
  }

]
