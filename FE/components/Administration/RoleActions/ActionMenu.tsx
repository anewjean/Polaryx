"use client"

import { useState } from "react"
import { Role } from "@/apis/roleApi"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { EllipsisVertical, KeyRound, Trash2 } from "lucide-react"

// 절대 경로로 임포트
import { DeleteRoleDialog } from "@/components/Administration/RoleActions/DeleteRoleDialog"
import { EditRoleDialog } from "@/components/Administration/RoleActions/EditRoleDialog"

export type OnRoleUpdated = () => void;

export interface ActionMenuProps {
  role: Role;
  onRoleUpdated?: OnRoleUpdated;
}

export function ActionMenu({ role, onRoleUpdated }: ActionMenuProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">              
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">            
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            <KeyRound className="h-4 w-4 mr-2" />
            역할 수정
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 역할 삭제 다이얼로그 */}
      <DeleteRoleDialog
        roleId={String(role.role_id)}
        roleName={role.role_name}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        onDeleteSuccess={onRoleUpdated}
      />

      {/* 역할 수정 다이얼로그 */}
      <EditRoleDialog
        role={role}
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        onEditSuccess={onRoleUpdated}
      />
    </>
  )
}
