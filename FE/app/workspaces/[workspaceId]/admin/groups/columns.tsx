"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { Group } from "@/apis/groupApi"
import { Member } from "@/apis/tabApi"
import { ActionMenu } from "@/components/Administration/GroupActions/ActionMenu"
 
export const groupColumns: ColumnDef<Group>[] = [
  
  {
    accessorKey: "group_name",
    header: "Group",
    size: 60,
    cell: ({ row }) => {
      const group_name = row.getValue("group_name") as string;
      return (
        <div className="flex items-center justify-start">
          {group_name}
        </div>
      );
    },
  },
  {
    accessorKey: "members",
    header: "Members",
    size: 80,
    cell: ({ row }) => {     
      const membersArray = row.getValue("members") as Member[];
      const membersCount = membersArray.length;

      return (
        <div className="max-w-[100px] truncate" title={String(membersCount)}>
          {membersCount}
        </div>
      );
    }
  },
  {
    accessorKey: "role",
    header: "Role",
    size: 80, 
    cell: ({ row }) => {     
      const role = row.getValue("role") as string;

      return (
        <div className="max-w-[80px] truncate" title={role}>
          {role}
        </div>
      );
    }
  },
  {
    id: "actions",
    header: "Actions",
    size: 60,
    cell: ({ row }) => {
      const group = row.original;
      
      return (
        <ActionMenu 
          group={group} 
          onRefresh={() => {}} // 페이지에서 전달받을 예정
        />
      );
    },
  }
]
