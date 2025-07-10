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

interface MyContextMenuProps {
  // workspaceId: number;
  // tapId: number;
  messageId: number;
  userId: string; // 작성자 id 추가
}

export function MyContextMenu({ messageId, userId }: MyContextMenuProps) {
  // 1) 프로필 보기
  const setProfileUserId = useProfileStore((s) => s.setUserId); // zustand store에 setUserId 함수 필요
  const openProfile = useProfileStore((s) => s.setOpen);
  // const params = useParams();

  // params.workspaceID;
  // params.tabID;

  // 2) 메시지 삭제
  const removeMessage = useMessageStore((s) => s.deleteMessage);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleDelete = async () => {
    console.log("handleDelete 들어옴");
    try {
      // 2-1) 백엔드 API 호출
      await deleteMessageApi("1", "1", messageId); // 추후 수정 22

      // 2-2) 로컬 store 에서 메시지 제거
      removeMessage(messageId);

      console.log("메시지 삭제 성공");
    } catch (e) {
      console.error("메시지 삭제 실패:", e);
    }
  };

  // 3) 메시지 수정 (미완성)
  const updateMessage = useMessageStore((s) => s.updateMessage);
  const handleEdit = async () => {
    const newContent = prompt("수정할 메시지를 입력하세요:");
    if (newContent === null) return; // 사용자가 취소를 선택하면 아무 작업도 하지 않음

    try {
      // 3-1) 백엔드 API 호출
      await updateMessageApi(messageId, newContent);

      // 3-2) 로컬 store 에서 메시지 업데이트
      // updateMessage(messageId, { id: messageId, content: newContent });

      console.log("메시지 수정 성공");
    } catch (e) {
      console.error("메시지 수정 실패:", e);
    }
  };

  return (
    <>
      {/* 우클릭시 메뉴 박스 */}
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
