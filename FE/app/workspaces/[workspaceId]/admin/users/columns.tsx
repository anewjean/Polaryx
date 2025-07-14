"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { Profile } from "@/apis/profileApi"
import { ActionMenu, OnUserUpdated } from "@/components/Administration/UserActions"

export const createUserColumns = (onUserUpdated?: OnUserUpdated): ColumnDef<Profile>[] => [
  
  {
    accessorKey: "image",
    header: "Profile",
    size: 60,
    cell: ({ row }) => {
      const imageUrl = row.getValue("image") as string;
      return (
        <div className="flex items-center justify-start">
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
    size: 100, 
    cell: ({ row }) => {     
      const nickname = row.getValue("nickname") as string;

      return (
        <div className="max-w-[100px] truncate" title={nickname}>
          {nickname}
        </div>
      );
    }
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 180, 
    cell: ({ row }) => {     
      const email = row.getValue("email") as string;

      return (
        <div className="max-w-[180px] truncate" title={email}>
          {email}
        </div>
      );
    }
  },
  {
    accessorKey: "role_name",
    header: "Role",
    size: 80, 
    cell: ({ row }) => {     
      const role = row.getValue("role_name") as string;

      return (
        <div className="max-w-[80px] truncate" title={role}>
          {role}
        </div>
      );
    }
  },  
  {
    accessorKey: "group_name",
    header: "Groups",
    size: 150, 
    cell: ({ row }) => {
      const groups = row.getValue("group_name") as string[];
      const groupsText = groups ? groups.join(", ") : "";
      
      return (
        <div className="max-w-[200px] truncate" title={groupsText}>
          {groupsText}
        </div>
      );
    }
  },
  {
    id: "actions",
    header: "Actions",
    size: 60,
    cell: ({ row }) => {      
      const user = row.original;
      const userId = user.user_id;
      const userName = user.nickname;
      const roleId = String(user.role_id || "");
      
      // 분리된 ActionMenu 컴포넌트 사용
      return <ActionMenu 
        userId={userId} 
        userName={userName} 
        roleId={roleId} 
        onUserUpdated={onUserUpdated} 
      />;
    },
  }
]

// 이전 버전과의 호환성을 위한 내보내기
export const userColumns = createUserColumns();
