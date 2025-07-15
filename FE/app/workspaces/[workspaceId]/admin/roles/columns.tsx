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
      // 기본 permissions 가져오기 - row.original을 통해 직접 접근
      let permissions = row.original.permissions as string[] || [];
      
      // DM 권한이 없으면 추가
      if (!permissions.includes("dm")) {
        permissions = [...permissions, "direct message"];
      }
      
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-row flex-wrap gap-1 w-full overflow-hidden">
              {permissions.length > 0 ? (
                permissions.map((permission, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                  >
                    {permission}
                  </span>
                ))
              ) : (
                <span className="text-gray-400">없음</span>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" align="start" sideOffset={5}>
            <div className="flex flex-col gap-1">
              {permissions.length > 0 ? 
                permissions.map((permission, index) => (
                  <span key={index}>{permission}</span>
                )) : 
                <span className="text-gray-400">없음</span>
              }
            </div>
          </TooltipContent>
        </Tooltip>
      );
    }
  },
  {
    accessorKey: "group_names",
    header: "Groups",
    size: 2, 
    cell: ({ row }) => {     
      // group_name 필드에 직접 접근
      const group_nameArray = row.original.group_names as string[] || [];

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-row truncate text-start w-full">
              {group_nameArray.length > 0 ? group_nameArray.join(", ") : "없음"}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" align="start" sideOffset={5}>
            <div className="flex flex-col gap-1">
              {group_nameArray.length > 0 ? 
                group_nameArray.map((group, index) => (
                  <span key={index}>{group}</span>
                )) : 
                <span className="text-gray-400">없음</span>
              }
            </div>
          </TooltipContent>
        </Tooltip>
      );
    }
  },
  {
    accessorKey: "user_names",
    header: "Members",
    size: 2.5, 
    cell: ({ row }) => {     
      // user_names 필드에 직접 접근
      const user_names = row.original.user_names as string[] || [];
      
      // 데이터가 없으면 빈 배열 사용
      if (!user_names || user_names.length === 0) {
        return <div className="text-gray-400">회원 없음</div>;
      }

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-row truncate justify-start w-full">
              {user_names.length > 0 ? user_names.join(", ") : "없음"}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" align="start" sideOffset={5}>
            <div className="flex flex-col gap-1">
              {user_names.length > 0 ? 
                user_names.map((user_name, index) => (
                  <span key={index}>{user_name}</span>
                )) : 
                <span className="text-gray-400">없음</span>
              }
            </div>
          </TooltipContent>
        </Tooltip>
      );
    }
  },
  

]
