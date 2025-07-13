"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { Profile } from "@/apis/profileApi"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVertical, SquareUserRound, Mail, KeyRound, Trash2, CircleCheck, Ban } from "lucide-react"
import EditRole from "@/components/modal/EditRole"
import { useState } from "react"
import { useParams } from "next/navigation"
import { deleteUser } from "@/apis/userApi"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
 
// 사용자 삭제 대화상자 컴포넌트
interface DeleteUserDialogProps {
  userId: string;
  userName: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onDeleteSuccess?: () => void;
}

function DeleteUserDialog({ userId, userName, isOpen, setIsOpen, onDeleteSuccess }: DeleteUserDialogProps) {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  
  const handleDelete = async () => {
    try {
      const result = await deleteUser(workspaceId, userId);
      
      if (result) {
        toast.success("사용자가 삭제되었습니다", {
          icon: <CircleCheck className="size-5" />,
        });
        
        // 삭제 후 목록 새로고침
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
      } else {
        toast.error("사용자 삭제에 실패했습니다", {
          icon: <Ban className="size-5" />,
        });
      }
    } catch (error) {
      console.error("사용자 삭제 중 오류 발생:", error);
      toast.error("사용자 삭제에 실패했습니다", {
        icon: <Ban className="size-5" />,
      });
    } finally {
      setIsOpen(false);
    }
  };
  
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>사용자 삭제</AlertDialogTitle>
          <AlertDialogDescription>
            {userName} 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// 사용자 목록 새로고침을 위한 함수 타입
type OnUserUpdated = () => void;

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
      
      // 삭제 대화상자 상태
      const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
      
      return (        
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">              
                <EllipsisVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">            
              <DropdownMenuItem>
                <SquareUserRound className="h-4 w-4 mr-2" />
                프로필 보기
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="h-4 w-4 mr-2" />
                메시지 보내기
              </DropdownMenuItem>
              
              <EditRole 
                userId={userId}
                currentRoleId={roleId}
                triggerComponent={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <KeyRound className="h-4 w-4 mr-2" />
                    역할 변경
                  </DropdownMenuItem>
                }
                onRoleUpdated={onUserUpdated}
              />
              
              <DropdownMenuItem 
                variant="destructive" 
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* 삭제 확인 대화상자 */}
          <DeleteUserDialog 
            userId={userId}
            userName={userName}
            isOpen={isDeleteDialogOpen}
            setIsOpen={setIsDeleteDialogOpen}
            onDeleteSuccess={onUserUpdated}
          />
        </>
      )
    },
  }
]

// 이전 버전과의 호환성을 위한 내보내기
export const userColumns = createUserColumns();
