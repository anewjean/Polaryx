"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { Role } from "@/apis/roleApi"
import { Member } from "@/apis/tabApi"
import { Badge } from "@/components/ui/badge"
import { ActionMenu } from "@/components/Administration/RoleActions/ActionMenu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// 권한 ID와 표시 이름 매핑
const permissionLabels: Record<string, string> = {
  "admin": "Admin",
  "announce": "Announcements",
  "course": "Courses",
  "channel": "Channels",
  "dm": "Direct Message"
}

export const roleColumns: ColumnDef<Role>[] = [
  {
    id: "actions",
    header: () => <div className="text-left pl-2">Actions</div>,
    size: 1,
    cell: ({ row }) => {
      const role = row.original;
      
      return (
        <div className="flex justify-start pl-2 w-full overflow-hidden">
          <ActionMenu 
            role={role} 
            onRoleUpdated={() => window.location.reload()} 
          />
        </div>
      );
    },
  },
  {
    accessorKey: "role_name",
    header: "Role",
    size: 1,
    cell: ({ row }) => {
      const role_name = row.getValue("role_name") as string;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-row truncate text-start w-full">
              {role_name}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" align="start" sideOffset={5}>
            <p>{role_name}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "permissions",
    header: "Permissions",
    size: 3, 
    cell: ({ row }) => {     
      const permissions = row.getValue("permissions") as string[];

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-row flex-wrap gap-1 w-full overflow-hidden">
              {permissions.map((permission, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                >
                  {permission}
                </span>
              ))}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" align="start" sideOffset={5}>
            <div className="flex flex-col gap-1">
              {permissions.map((permission, index) => (
                <span key={index}>{permission}</span>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      );
    }
  },
  {
    accessorKey: "group_name",
    header: "Groups",
    size: 2, 
    cell: ({ row }) => {     
      const group_nameArray = row.getValue("group_name") as string[];      

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-row truncate text-start w-full">
              {group_nameArray.join(", ")}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" align="start" sideOffset={5}>
            <div className="flex flex-col gap-1">
              {group_nameArray.map((group, index) => (
                <span key={index}>{group}</span>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      );
    }
  },
  {
    accessorKey: "members",
    header: "Members",
    size: 2.5, 
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
            <div className="flex flex-col gap-1">
              {nicknames.map((nickname, index) => (
                <span key={index}>{nickname}</span>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      );
    }
  },
  

]
