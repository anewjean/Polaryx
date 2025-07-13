import { MiniProfile } from "./MiniProfile";
import { ImageWithModal } from "./imageWithModal";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { MyContextMenu } from "./MyContextMenu";
import { FileDownload } from "@/components/chat/fileUpload/FileUpload";
import DOMPurify from "dompurify";
import ChatEditTiptap from "./ChatEditTiptap";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { updateMessage as updateMessageApi } from "@/apis/messageApi";
import { useMessageStore } from "@/store/messageStore";
import { jwtDecode } from "jwt-decode";

interface ChatProfileProps {
  senderId: string;
  msgId: number;
  imgSrc: string;
  nickname: string;
  time: string;
  content: string;
  showProfile: boolean;
  fileUrl: string | null;
  isUpdated: number;
}

function isImageFile(url: string) {
  return /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(url);
}

export function ChatProfile({
  senderId,
  msgId,
  imgSrc,
  nickname,
  time,
  content,
  showProfile,
  fileUrl,
  isUpdated,
}: ChatProfileProps) {
  // 유저 id 상태 관리
  const [userId, setUserId] = useState<string | null>(null);

  const safeHTML = DOMPurify.sanitize(content, {
    FORBID_TAGS: ["img"], // 👈 img 태그 완전 제거
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const tabId = params.tabId as string;
  const updateMessage = useMessageStore((s) => s.updateMessage);

  // 메시지 저장 핸들러
  const handleSave = async (newContent: string) => {
    setEditContent(newContent);
    setIsEditMode(false);
    try {
      await updateMessageApi(workspaceId, tabId, msgId, newContent); // 서버에 PATCH
      updateMessage(msgId, newContent); // store 갱신
    } catch (e) {
      alert("메시지 수정 실패");
    }
  };

  // 메시지 취소 핸들러
  const handleCancel = () => {
    setIsEditMode(false);
  };  

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={`flex px-[8px] py-[4.5px] group${isEditMode ? " bg-blue-50" : " hover:bg-[#F4F4F4]"}`}
        >
          {/* showProfile이면, 프로필 사진 + 이름 + 채팅 보여줌. 아니면 채팅만 */}
          {showProfile ? (
            <div className="relative">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <button className="w-[40px] mr-[8px] cursor-pointer">
                    <img
                      src={imgSrc}
                      className="w-[40px] h-[40px] mt-1 rounded-lg object-cover bg-gray-400"
                      alt="profile"
                    />
                  </button>
                </HoverCardTrigger>
                <MiniProfile
                  senderId={senderId}
                  imgSrc={imgSrc}
                  nickname={nickname}
                />
              </HoverCard>
            </div>
          ) : (
            <div className="flex flex-shrink-0 items-center justify-end text-xxs chat-time-stamp w-[40px] mr-[8px]">
              <div className="hidden group-hover:block">
                {time.split(" ")[1]}
              </div>
            </div>
          )}

          <div className="w-full m-[-12px 8px -16px -16px] p-[8px 8px 8px 16px]">
            {isEditMode ? (
              <>
                {showProfile && (
                  <div className="flex items-baseline space-x-1 mb-1"></div>
                )}
                <ChatEditTiptap
                  initialContent={editContent}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              </>
            ) : (
              <>
                {showProfile && (
                  <div className="flex items-baseline space-x-1">
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <span className="text-m-bold cursor-pointer hover:underline">
                          {nickname}
                        </span>
                      </HoverCardTrigger>
                      <MiniProfile
                        senderId={senderId}
                        imgSrc={imgSrc}
                        nickname={nickname}
                      />
                    </HoverCard>

                    <span className="text-xs chat-time-stamp">{time}</span>
                  </div>
                )}
                {fileUrl && isImageFile(fileUrl) && (
                  <ImageWithModal fileUrl={fileUrl} />
                )}
                {fileUrl && !isImageFile(fileUrl) && (
                  <FileDownload fileUrl={fileUrl} />
                )}

                <div className="flex flex-wrap flex-row items-center message-content whitespace-pre-wrap break-words break-anywhere text-m">
                  <div
                    className="mr-2"
                    dangerouslySetInnerHTML={{ __html: safeHTML }}
                  />
                  {isUpdated ? (
                    <span
                      className="text-xs text-gray-500"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      (편집됨)
                    </span>
                  ) : null}
                </div>
              </>
            )}
          </div>
        </div>
      </ContextMenuTrigger>

      <MyContextMenu
          messageId={msgId}
          userId={senderId}
          content={editContent}
          onEdit={() => setIsEditMode(true)}
        />
    </ContextMenu>
  );
}
