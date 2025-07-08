"use client";

import { ContextMenuContent, ContextMenuItem } from "@/components/ui/context-menu";
import { deleteMessage as deleteMessageApi, updateMessage as updateMessageApi } from "@/apis/messages";
import { useMessageStore } from "@/store/messageStore";
import { useProfileStore } from "@/store/profileStore";
import { useParams } from "next/navigation";

interface MyContextMenuProps {
  // workspaceId: number;
  // tapId: number;
  messageId: number;
}

// 추후 수정 : workspaceId, tabId 추가해야 함. 우선은 하드 코딩으로 진행함
export function MyContextMenu({ messageId }: MyContextMenuProps) {
  // 1) 프로필 보기
  const openProfile = useProfileStore((s) => s.setOpen);
  // const params = useParams();

  // params.workspaceID;
  // params.tabID;

  // 2) 메시지 삭제
  const removeMessage = useMessageStore((s) => s.deleteMessage);
  const handleDelete = async () => {
    console.log("handleDelete 들어옴");
    if (!confirm("메시지를 삭제하시겠습니까?")) {
      return; // 사용자가 취소를 선택하면 아무 작업도 하지 않음
    }
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

  // 3) 메시지 수정
  const updateMessage = useMessageStore((s) => s.updateMessage);
  const handleEdit = async () => {
    const newContent = prompt("수정할 메시지를 입력하세요:");
    if (newContent === null) return; // 사용자가 취소를 선택하면 아무 작업도 하지 않음

    try {
      // 3-1) 백엔드 API 호출
      await updateMessageApi(messageId, newContent);

      // 3-2) 로컬 store 에서 메시지 업데이트
      updateMessage(messageId, { id: messageId, content: newContent });

      console.log("메시지 수정 성공");
    } catch (e) {
      console.error("메시지 수정 실패:", e);
    }
  };

  return (
    <ContextMenuContent>
      <ContextMenuItem onClick={openProfile}>프로필 보기</ContextMenuItem>
      <ContextMenuItem>메시지 편집</ContextMenuItem>
      <ContextMenuItem onClick={handleDelete}>메시지 삭제</ContextMenuItem>
    </ContextMenuContent>
  );
}
