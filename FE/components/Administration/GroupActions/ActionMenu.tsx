"use client"

import { useState } from "react"
import { Group } from "@/apis/groupApi"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { EllipsisVertical, KeyRound } from "lucide-react"
import { EditRoleDialog } from "./EditRoleDialog"

export type OnGroupUpdated = () => void;

interface ActionMenuProps {
  group: Group;
  onRefresh?: OnGroupUpdated;
}

export function ActionMenu({ group, onRefresh }: ActionMenuProps) {
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false);

  return (
    <div>
      {/* 역할 수정 다이얼로그 */}
      <EditRoleDialog
        group={group}
        isOpen={isEditRoleDialogOpen}
        setIsOpen={setIsEditRoleDialogOpen}
        onEditSuccess={onRefresh}
      />

      {/* 액션 메뉴 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">메뉴 열기</span>
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditRoleDialogOpen(true)}>
            <KeyRound className="mr-2 h-4 w-4" />
            <span>역할 수정</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
