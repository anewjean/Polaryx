import { useState, useEffect, ReactNode } from "react";
import {
  PopoverTrigger,
  Popover,
  PopoverContent,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SaveMessage as ApiSaveMessage, getSaveMessages, addSaveMessage, deleteSaveMessage } from "@/apis/saveMessageApi";
import { useMyUserStore } from "@/store/myUserStore";
import { toast } from "sonner";
import { CircleCheck, Ban } from "lucide-react";

// 항목 타입 정의
type messageItem = ApiSaveMessage;

// props 타입 정의
interface SaveMessagesProps {
  workspaceId: string;
  children: React.ReactNode;
  openPopover: boolean;
  setOpenPopover: (open: boolean) => void;
}

export default function SaveMessages({ workspaceId, children, openPopover, setOpenPopover }: SaveMessagesProps) {
  // 툴팁 상태 관리
  const [openTooltip, setOpenTooltip] = useState(false);

  // 유저 id 불러오기
  const userId = useMyUserStore((state) => state.userId);

  // 저장 메시지 상태 관리
  const [saveMessages, setSaveMessages] = useState<messageItem[]>([]);

  // 에러 상태 관리
  const [error, setError] = useState<string | null>(null);

  // 로딩 상태 관리
  const [loading, setLoading] = useState(false);

  // 팝오버가 열리면 툴팁 닫기
  useEffect(() => {
    if (openPopover) {
      setOpenTooltip(false);
    }
  }, [openPopover]);

  // 저장 메시지 가져오기
  useEffect(() => {
    if (!workspaceId || !userId) return;

    const fetchSaveMessages = async () => {
      try{
        setLoading(true);
        const data = await getSaveMessages(workspaceId, userId);
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

  return (
    <Popover open={openPopover} onOpenChange={setOpenPopover}>
      <Tooltip
        // 팝오버가 닫혀 있을 때만 호버 트리거에 반응
        open={openTooltip && !openPopover}
        onOpenChange={setOpenTooltip}
      >
        {/* TooltipTrigger 와 PopoverTrigger 를 asChild 로 중첩하여 동일한 버튼에 이벤트 핸들러 부착 */}
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            {children}
          </PopoverTrigger>
        </TooltipTrigger>

        <TooltipContent className="flex flex-col text-xs text-center gap-1">
          <div>저장 메시지</div>
          <div>추가하기</div>
        </TooltipContent>
      </Tooltip>

      <PopoverContent
        side="top"
        align="end"
        className="w-100 bg-white text-black border mb-0.5 mr-1"
      >
        <div>
          <div className="flex flex-row items-center justify-between pl-5 pr-3 py-3">
            <div className="text-m-bold">저장 메시지</div>
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 cursor-pointer rounded-full"
            >
              <Plus className="!h-4 !w-4 text-gray-500" />
            </Button>
          </div>
          
          
          <div className="flex flex-row justify-between pl-5 pr-3 border-t-1 border-gray-200 hover:bg-gray-100 cursor-default">
            {loading && (
              <div className="py-3 text-sm text-center">메시지 불러오는 중</div>
            )}

            {error && (
              <div className="py-3 text-sm text-center text-red-500">{error}</div>
            )}

            {saveMessages.map((message) => (
              <div>
                <div key={message.content} className="text-sm mr-2 py-3">
                  <p>{message.content}</p>
                </div>
                {/* 메시지 삭제 버튼 */}
                <div onClick={() => handleDeleteSaveMessage(message.save_message_id)} className="pb-3 flex items-end justify-end">
                  <Trash2 className="w-5 h-5 mt-2 cursor-pointer text-gray-400 hover:text-red-300 hover:fill-red-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
