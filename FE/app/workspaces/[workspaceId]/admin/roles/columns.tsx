"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { Member } from "@/apis/tabApi"
import { Button } from "@/components/ui/button"
import { Role } from "@/apis/roleApi"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVertical, SquareUserRound, Mail, KeyRound, Trash2, UserRound } from "lucide-react"
 
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
        <div className="max-w-[300px] truncate" title={permissions.join(", ")}>
          {permissions.join(", ")}
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
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">              
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">            
            <DropdownMenuItem><KeyRound className="h-4 w-4" />Edit Role</DropdownMenuItem>
            <DropdownMenuItem><UserRound className="h-4 w-4" />Edit Members</DropdownMenuItem>                        
            <DropdownMenuItem variant="destructive"><Trash2 className="h-4 w-4" />Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
]
