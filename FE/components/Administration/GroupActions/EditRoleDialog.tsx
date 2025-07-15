"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Group } from "@/apis/groupApi"
import { DialogModal } from "@/components/modal/DialogModal"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { CircleCheck, Ban } from "lucide-react"
import { useRoleStore } from "@/store/roleStore"
import { useGroupStore } from "@/store/groupStore"
import { updateGroupRole } from "@/apis/groupApi"

interface EditRoleDialogProps {
  group: Group;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onEditSuccess?: () => void;
}

export function EditRoleDialog({ group, isOpen, setIsOpen, onEditSuccess }: EditRoleDialogProps) {
  // URL에서 workspaceId 추출
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  // 역할과 그룹 정보를 전역 상태에서 가져오기
  const { roles, loadingRoles, fetchRoles } = useRoleStore();
  const { fetchGroups } = useGroupStore();

  // 역할 선택 상태 관리 (초기값은 현재 역할)
  const [selectedRoleId, setSelectedRoleId] = useState<string>(
    group.role_id ? String(group.role_id) : ""
  );

  // 모달이 열릴 때 역할 목록 불러오기
  const handleModalOpenChange = (open: boolean) => {
    setIsOpen(open);

    if (open) {
      fetchRoles(workspaceId);
      
      // 현재 그룹의 역할 ID로 초기화
      const safeRoleId = group.role_id ? String(group.role_id) : "";
      setSelectedRoleId(safeRoleId);
    }
  };

  // 역할 변경 저장 핸들러
  const handleSaveRole = async () => {
    if (!selectedRoleId) {
      toast.error("역할을 선택해주세요", {
        icon: <Ban className="size-5" />,
      });
      return;
    }

    try {
      const result = await updateGroupRole(workspaceId, String(group.group_id), selectedRoleId);
      
      if (result) {
        toast.success("그룹 역할이 변경되었습니다", {
          icon: <CircleCheck className="size-5" />,
        });
        handleModalOpenChange(false);
        
        // 성공 시에만 전역 그룹 상태 갱신
        await fetchGroups(workspaceId);
        
        // 콜백 함수 호출 (부모 컴포넌트에서 그룹 목록 새로고침 등)
        if (onEditSuccess) {
          onEditSuccess();
        }
      } else {
        toast.error("그룹 역할 변경에 실패했습니다", {
          icon: <Ban className="size-5" />,
        });
      }
    } catch (error) {      
      toast.error("그룹 역할 변경에 실패했습니다", {
        icon: <Ban className="size-5" />,
      });
    }
  };

  return (
    <DialogModal
      title="그룹 역할 변경"
      open={isOpen}
      onOpenChange={handleModalOpenChange}
      trigger={<div />} // 필수 prop이지만 사용하지 않으므로 빈 div 사용
    >
      <div className="flex flex-col gap-6 py-4 pb-0">
        <div className="flex flex-col gap-3">
          {loadingRoles ? (
            <div className="py-4 text-center">역할을 불러오는 중입니다...</div>
          ) : (
            <RadioGroup
              value={selectedRoleId}
              onValueChange={setSelectedRoleId}
              className="grid grid-cols-2 gap-2"
            >
              {roles.map((role) => (
                <div
                  key={role.role_id}
                  className="flex items-center space-x-2"
                >
                  <RadioGroupItem
                    value={String(role.role_id)}
                    id={`role-${role.role_id}`}
                  />
                  <Label htmlFor={`role-${role.role_id}`} className="flex-1">
                    {role.role_name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>

        <div className="flex justify-between gap-3 mt-4">
          <Button
            variant="outline"
            onClick={() => handleModalOpenChange(false)}
            className="flex-1"
          >
            취소
          </Button>
          <Button
            onClick={handleSaveRole}
            disabled={!selectedRoleId || selectedRoleId === String(group.role_id)}
            className="flex-1"
          >
            설정
          </Button>
        </div>
      </div>
    </DialogModal>
  );
}
