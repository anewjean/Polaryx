
import { MiniProfile } from "./MiniProfile";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { deleteMessage } from "@/apis/messageApi";
import { toast } from "sonner";
import { Ban } from "lucide-react";
import { ImageWithModal } from "./imageWithModal";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { MyContextMenu } from "./MyContextMenu";
import { FileDownload } from "@/components/chat/fileUpload/FileUpload";
import DOMPurify from "dompurify";
import ChatEditTiptap from "./ChatEditTiptap";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { updateMessage as updateMessageApi } from "@/apis/messageApi";
import { useMessageStore } from "@/store/messageStore";
import { useProfileStore } from "@/store/profileStore";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { WebSocketLikeClient } from "@/components/ws/webSocketLikeClient"; // 새로 만든 컴포넌트 import
import { jwtDecode } from "jwt-decode";
import { MessageMenu } from "./MessageMenu";
/////////////////////////////////////////////////////////////
// likeStore 사용. 좋아요 데이터 관리.
import { useLikeStore } from "@/store/likeStore";
/////////////////////////////////////////////////////////////

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
  className?: string;
  ///////////////////////////////////////////////////////////////
  // likeStore 사용. 좋아요 데이터 관리.
  likeCount: number; // likeCount prop 추가
  isLikedByMe: boolean; // 토글 기능: prop 추가
  ///////////////////////////////////////////////////////////////
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
  className,
  ///////////////////////////////////////////////////////////////
  // likeStore 사용. 좋아요 데이터 관리.
  likeCount, // prop 받기
  isLikedByMe, // prop 받기
  ///////////////////////////////////////////////////////////////
}: ChatProfileProps) {
  // 유저 id 상태 관리
  const [userId, setUserId] = useState<string | null>(null);

  // 프로필
  const openProfile = useProfileStore((s) => s.openWithId);
  const removeMessage = useMessageStore((s) => s.deleteMessage);

  const safeHTML = DOMPurify.sanitize(content, {
    FORBID_TAGS: ["img"], // 👈 img 태그 완전 제거
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const tabId = params.tabId as string;
  const updateMessage = useMessageStore((s) => s.updateMessage);
  
  ///////////////////////////////////////////////////////////////
  // likeStore 사용. 좋아요 데이터 관리.
  const toggleLike = useLikeStore((s) => s.toggleLike);
  ///////////////////////////////////////////////////////////////

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

  // 메시지 호버 상태 관리(메시지 메뉴 표시)
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // 메시지 삭제 핸들러
  const handleDelete = async (id: number) => {
    try {
      // API 호출
      await deleteMessage(workspaceId as string, tabId as string, id);
      // 로컬 store 에서 메시지 제거
      removeMessage(id);
    } catch (e) {
      toast.error("메시지 삭제에 실패했습니다", {
        icon: <Ban className="size-5" />,
      });
    }
  };

  const closeMenu = () => {
    setIsHovered(false);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsDeleteDialogOpen(false);
  };

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
    setIsHovered(false); // 메뉴를 닫는 로직을 이 함수에 통합
  };

  // 메시지 취소 핸들러
  const handleCancel = () => {
    setIsEditMode(false);
  };

  /////////////////////////////////////////////////////////////////
  // 내 userId 가져오기 (예시: localStorage에서)
  const [myUserId, setMyUserId] = useState<string>(""); // 이건 그대로 사용
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      const { user_id } = jwtDecode(token) as { user_id: string };
      setMyUserId(user_id);
    }
  }, []);

  // 좋아요 버튼 클릭 핸들러
  const handleLike = () => {
    console.log("handleLike clicked");
    if (myUserId) {
      // 이제 '좋아요'를 누르면 store의 상태를 변경하여 전송을 "요청"합니다.
      toggleLike(msgId, myUserId);
    } else {
      console.warn("Cannot like: myUserId is not set.");
    }
  };
  /////////////////////////////////////////////////////////////////

  return (    
    <div
      onMouseEnter={() => {
        if (!isDeleteDialogOpen) {
          setIsHovered(true);
        }
      }}
      onMouseLeave={handleMouseLeave}      
      className={
        cn(`relative flex px-[8px] py-[4.5px] group${isEditMode ? " bg-blue-50" : " hover:bg-muted"}`,className)}      
    >
      {/* showProfile(마지막 메세지로부터 5분 이후)이면, 프로필 사진, 이름, 메시지 표시. 아니면 메시지만 */}
      {showProfile ? (
        <div className="relative">
          <HoverCard>
            <HoverCardTrigger asChild>
              <button
                onClick={() => openProfile(senderId)}
                className="w-[40px] mr-[8px] cursor-pointer"
              >
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
                    <span
                      onClick={() => openProfile(senderId)}
                      className="text-m-bold cursor-pointer hover:underline"
                    >
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
            {isLikedByMe ? (
              <div
                className="p-1 flex mt-0.5 justify-start items-center w-[32px] min-w-[32px] h-4.5 border-1 rounded-full gap-0.5 cursor-pointer"
              >
                <Star className="w-3 h-3 fill-current" />
                <p className="text-xxs">{likeCount}</p>
              </div>
            ) : null}                
            <div
              className="p-1 flex mt-0.5 justify-start items-center w-[32px] min-w-[32px] h-4.5 border-1 rounded-full gap-0.5 cursor-pointer"
            >
              <Star className="w-3 h-3 fill-current" />
              <p className="text-xxs">{likeCount}</p>
            </div>                              
            <div
              className={`p-1 flex mt-0.5 justify-start items-center w-[32px] min-w-[32px] h-4.5 border-1 rounded-full gap-0.5 cursor-pointer ${
                isLikedByMe
                  ? "bg-blue-100 border-blue-600 text-blue-600"
                  : "bg-gray-100 border-gray-300 text-gray-600"
              }`}
              onClick={handleLike}
            >
              <Star
                className={`w-3 h-3 ${isLikedByMe ? "fill-current" : ""}`}
              />
              <p className="text-xxs">{likeCount}</p>
            </div>
            <div className="text-white p-1 flex mt-0.5 justify-center items-center w-8 h-4.5 bg-gray-300 rounded-full gap-0.5">
              <Star className="w-3 h-3 fill-current" />
              <p className="text-xxs">1</p>
            </div>
          </>
        )}
      </div>
      {!isEditMode && isHovered && !isDeleteDialogOpen && (
      <div className="absolute -top-5 right-2">
        <MessageMenu
          msgId={msgId}
          userId={senderId}
          content={editContent}
          onEdit={() => setIsEditMode(true)}
          onDelete={openDeleteDialog}
          onClose={closeMenu}
        />
      </div>
      )}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>메시지 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              메시지를 삭제하시겠습니까? 이 작업은 실행 취소할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(msgId)}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
