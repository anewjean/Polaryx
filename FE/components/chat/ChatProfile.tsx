import { MiniProfile } from "./MiniProfile";
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
import { Star } from "lucide-react";
import { WebSocketLikeClient } from "@/components/ws/webSocketLikeClient"; // 새로 만든 컴포넌트 import
import { jwtDecode } from "jwt-decode";
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
                <div
                  className={`p-1 flex mt-0.5 justify-center items-center w-auto min-w-[32px] h-4.5 border-1 rounded-full gap-0.5 cursor-pointer ${
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
