"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { Group } from "@/apis/groupApi"
import { Member } from "@/apis/tabApi"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVertical, UsersRound, SquareUserRound, Mail, KeyRound, Trash2, Undo2 } from "lucide-react"
 
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
      return (        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">              
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">            
            <DropdownMenuItem><UsersRound className="h-4 w-4" />Edit Members</DropdownMenuItem>
            <DropdownMenuItem><KeyRound className="h-4 w-4" />Edit Role</DropdownMenuItem>
            <DropdownMenuItem><Undo2 className="h-4 w-4" />Set All Members to Guest</DropdownMenuItem>
            <DropdownMenuItem variant="destructive"><Trash2 className="h-4 w-4" />Delete All Users</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
]
