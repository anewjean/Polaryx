"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { Member } from "@/apis/tabApi"
import { Role } from "@/apis/roleApi"
import { Badge } from "@/components/ui/badge"
import { ActionMenu } from "@/components/Administration/RoleActions/ActionMenu"

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
    accessorKey: "role_name",
    header: "Role",
    size: 80,
    cell: ({ row }) => {
      const role_name = row.getValue("role_name") as string;
      return (
        <div className="flex items-center justify-start">
          {role_name}
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
    accessorKey: "permissions",
    header: "Permissions",
    size: 300, 
    cell: ({ row }) => {     
      const permissions = row.getValue("permissions") as string[];

      return (
        <div className="flex flex-wrap gap-1 max-w-[300px]">
          {permissions.map((permission) => (
            <Badge 
              key={permission} 
              variant="outline"
              className="bg-gray-100 text-gray-800"
            >
              {permissionLabels[permission] || permission}
            </Badge>
          ))}
        </div>
      );
    }
  },
  {
    id: "actions",
    header: "Actions",
    size: 50,
    cell: ({ row }) => {
      const role = row.original;
      
      return <ActionMenu role={role} onRoleUpdated={() => window.location.reload()} />;
    },
  }
]
