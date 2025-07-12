"use client";

import { ContextMenuContent, ContextMenuItem } from "@/components/ui/context-menu";
import { deleteMessage as deleteMessageApi, updateMessage as updateMessageApi } from "@/apis/messageApi";
import { useMessageStore } from "@/store/messageStore";
import { useProfileStore } from "@/store/profileStore";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EditInput } from "./EditInput";
import { useParams } from "next/navigation";
import { useMyUserStore } from "@/store/myUserStore";

interface MyContextMenuProps {
  messageId: number;
  userId: string; // 작성자 id 추가
  content: string; // 메시지 내용 prop 추가
  onEdit: () => void; // 편집 모드 진입 함수 prop 추가
}

export function MyContextMenu({ messageId, userId, content, onEdit }: MyContextMenuProps) {
  // 내 userId 추출
  const myUserId = useMyUserStore((s) => s.userId);
  
  // workspace id, tab id 추출
  const params = useParams();
  const workspaceId = params.workspaceId;
  const tabId = params.tabId;

  // 1) 프로필 보기
  const setProfileUserId = useProfileStore((s) => s.setUserId);
  const openProfile = useProfileStore((s) => s.setOpen);

  // 2) 메시지 삭제
  const removeMessage = useMessageStore((s) => s.deleteMessage);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {  
      // 2-1) 백엔드 API 호출
      await deleteMessageApi(workspaceId as string, tabId as string, messageId);

      // 2-2) 로컬 store 에서 메시지 제거
      removeMessage(messageId);

      console.log("메시지 삭제 성공");
    } catch (e) {
      console.log("메시지 삭제 실패:", e);
    }
  };

  // 3) 메시지 수정 (미완성)
  const updateMessage = useMessageStore((s) => s.updateMessage);

  const [isEditMode, setIsEditMode] = useState(false);
  // handleEdit 함수는 상위에서 내려온 onEdit을 호출
  const handleEdit = () => {
    onEdit();
  };

  return (
    <>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => { setProfileUserId(userId); openProfile(); }}>프로필 보기</ContextMenuItem>
        <ContextMenuItem onClick={handleEdit}>메시지 편집</ContextMenuItem>
        <ContextMenuItem onClick={() => setIsDialogOpen(true)}>메시지 삭제</ContextMenuItem>
      </ContextMenuContent>
      {/* 삭제 메시지 확인 다이얼로그 */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>메시지 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              메시지를 삭제하시겠습니까? 이 작업은 실행 취소할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}