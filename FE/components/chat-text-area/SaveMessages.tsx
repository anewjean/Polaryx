import { useState, useEffect, ReactNode } from "react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card"
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SaveMessage as ApiSaveMessage, getSaveMessages, addSaveMessage, deleteSaveMessage } from "@/apis/saveMessageApi";
import { useMyUserStore } from "@/store/myUserStore";
import { toast } from "sonner";
import { CircleCheck, Ban } from "lucide-react";
import { Editor } from "@tiptap/react";

// 항목 타입 정의
type messageItem = ApiSaveMessage;

// props 타입 정의
interface SaveMessagesProps {
  workspaceId: string;
  children: React.ReactNode;
  openPopover: boolean;
  setOpenPopover: (open: boolean) => void;
  editor?: Editor;
  onAddMessage?: (content: string) => void;
}

export default function SaveMessages({ workspaceId, children, openPopover, setOpenPopover, editor, onAddMessage }: SaveMessagesProps) {
  // 유저 id 불러오기
  const userId = useMyUserStore((state) => state.userId);

  // 저장 메시지 상태 관리
  const [saveMessages, setSaveMessages] = useState<messageItem[]>([]);

  // 에러 상태 관리
  const [error, setError] = useState<string | null>(null);

  // 로딩 상태 관리
  const [loading, setLoading] = useState(false);

  // 저장 메시지 가져오기
  useEffect(() => {
    if (!workspaceId || !userId) return;

    const fetchSaveMessages = async () => {
      try{
        setLoading(true);
        const data = await getSaveMessages(workspaceId, userId);

        if (!data) return;
        setSaveMessages(data);
      } catch {
        setError("저장 메시지 조회에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }
    fetchSaveMessages();
  }, [workspaceId, userId]);

  // 저장 메시지 추가
  const handleAddSaveMessage = async (content: string) => {
    if (!workspaceId || !userId) return;

    try {
      await addSaveMessage(workspaceId, userId, content);
      // 다른 유저와 동기화될 필요가 없으므로, 낙관적 업데이트 방식 사용 (직접 갱신)
      setSaveMessages((prev) => [...prev, { content, save_message_id: userId.toString() }]);
    } catch {
      setError("저장 메시지 추가에 실패했습니다.");
    }
  };

  // 저장 메시지 삭제
  const handleDeleteSaveMessage = async (saveMessageId: string) => {
    if (!workspaceId || !userId) return;

    try {
      await deleteSaveMessage(workspaceId, saveMessageId, userId);
      setSaveMessages((prev) => prev.filter((m) => m.save_message_id !== saveMessageId));

      toast.success("저장 메시지가 삭제되었습니다", {
        icon: <CircleCheck className="size-5" />,
      });
    } catch {
      toast.error("저장 메시지 삭제에 실패했습니다.", {
        icon: <Ban className="size-5" />,
      });
    }
  };

  // 현재 에디터의 내용을 저장 메시지로 추가
  const addCurrentContent = () => {
    // 1) SSR 환경에서는 window가 없기 때문에, 브라우저에서만 실행되도록 한 안전장치
    if (typeof window !== "undefined") {
      // 2) DOM에서 클래스명이 .ProseMirror인 첫 번째 요소를 찾아서 input에 담음
      const input = document.querySelector('.ProseMirror') as HTMLElement | null;
      // 3) 에디터 엘리먼트가 존재하면 그 안의 문자열(innerHTML)을 content에 담음
      let content = "";
      if (input) {
        content = input.innerHTML;
      }
      // 4) content가 비어있지 않으면 handleAddSaveMessage 함수를 호출하고
      if (content.trim()) {
        handleAddSaveMessage(content);
        // 5) 부모 컴포넌트에서 onAddMessage라는 콜백을 prop으로 넘겨줬다면,
        // 그 함수에도 동일한 콘텐츠를 전달해 "메시지 추가" 이벤트를 알림
        if (typeof onAddMessage === 'function') onAddMessage(content);
      }
    }
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>

      <HoverCardContent
        side="top"
        align="end"
        className="w-100 bg-white text-black border m-0 p-0 mb-0.5 mr-1"
      >
        <div>
          <div className="flex flex-row items-center justify-between pl-5 pr-3 py-3">
            <div className="text-m-bold">저장 메시지</div>
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 cursor-pointer rounded-full"
              onClick={addCurrentContent}
            >
              <Plus className="!h-4 !w-4 text-gray-500" />
            </Button>
          </div>
        
        
          <div className="border-t-1 border-gray-200 flex flex-col max-h-80 overflow-y-auto scrollbar-thin">
            {loading && (
              <div className="py-3 text-sm text-center">메시지 불러오는 중</div>
            )}

            {error && (
              <div className="py-3 text-sm text-center text-red-500">{error}</div>
            )}

            {saveMessages.length === 0 ? (
              <div className="px-5 py-3 text-sm text-gray-500">
                저장할 메시지를 추가해주세요
              </div>
            ) : (
              saveMessages.map((message, idx) => (
                <div
                  key={message.save_message_id}
                  onClick={() => editor?.commands.setContent(message.content)} 
                  className={`
                    ${idx !== 0 ? 'border-t-1' : ''}
                    border-gray-200 flex flex-row justify-between hover:bg-gray-100 cursor-pointer`}
                >
                  <div className="flex-1 message-content text-sm px-5 py-3">
                    <div dangerouslySetInnerHTML={{ __html: message.content }} />
                  </div>
                  {/* 메시지 삭제 버튼 */}
                  <div onClick={() => handleDeleteSaveMessage(message.save_message_id)} className="pr-3 pb-3 flex items-end justify-end">
                    <Trash2 className="w-5 h-5 mt-2 cursor-pointer text-gray-400 hover:text-red-300 hover:fill-red-100" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
