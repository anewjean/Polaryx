"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { Profile } from "@/apis/profileApi"
import { ActionMenu, OnUserUpdated } from "@/components/Administration/UserActions"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const createUserColumns = (onUserUpdated?: OnUserUpdated): ColumnDef<Profile>[] => [
  {
    id: "actions",
    header: () => <div className="text-left pl-2">Actions</div>,
    size: 1,
    cell: ({ row }) => {      
      const user = row.original;
      const userId = user.user_id;
      const userName = user.nickname;
      const roleId = String(user.role_id || "");
      
      // 분리된 ActionMenu 컴포넌트 사용
      return (
        <div className="flex justify-start pl-2 w-full overflow-hidden">
          <ActionMenu 
            userId={userId} 
            userName={userName} 
            roleId={roleId} 
            onUserUpdated={onUserUpdated} 
          />
        </div>
      );
    },
  },
  {
    accessorKey: "image",
    header: "Profile",
    size: 1,
    cell: ({ row }) => {
      const imageUrl = row.getValue("image") as string;
      return (
        <div className="flex items-center justify-start w-full overflow-hidden">
          <img 
            src={imageUrl} 
            alt="프로필 이미지" 
            className="h-10 w-10 rounded-full object-cover"
          />
        </div>
      ); 
    },
  },
  {
    accessorKey: "nickname",
    header: "Nickname",
    size: 1.5, 
    cell: ({ row }) => {     
      const nickname = row.getValue("nickname") as string;

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-row truncate text-start w-full">
              {nickname}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" align="start" sideOffset={5}>
            <p>{nickname}</p>
          </TooltipContent>
        </Tooltip>
      );
    }
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 2.5, 
    cell: ({ row }) => {     
      const email = row.getValue("email") as string;

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-row truncate text-start w-full">
              {email}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" align="start" sideOffset={5}>
            <p>{email}</p>
          </TooltipContent>
        </Tooltip>
      );
    }
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
    accessorKey: "group_name",
    header: "Groups",
    size: 2.5, 
    cell: ({ row }) => {
      const groups = row.getValue("group_name") as string[];
      const groupsText = groups ? groups.join(", ") : "";
      
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-row truncate text-start w-full">
              {groupsText}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" align="start" sideOffset={5}>
            <div className="flex flex-col gap-1">
              {groups && groups.length > 0 ? (
                groups.map((group, index) => (
                  <span key={index}>{group}</span>
                ))
              ) : (
                <span>그룹 없음</span>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      );
    }
  },

]

// 이전 버전과의 호환성을 위한 내보내기
export const userColumns = createUserColumns();
