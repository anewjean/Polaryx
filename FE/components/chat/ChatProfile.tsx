import { MiniProfile } from "./MiniProfile";
import { ImageWithModal } from "./imageWithModal";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { MyContextMenu } from "./MyContextMenu";
import { FileDownload } from "@/components/chat/fileUpload/FileUpload";

interface ChatProfileProps {
  senderId: Buffer;
  msgId: number;
  imgSrc: string;
  nickname: string;
  time: string;
  content: string;
  showProfile: boolean;
  fileUrl: string | null;
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
}: ChatProfileProps) {
  const text = content.replace(/\n+$/, ""); // 마지막 줄의 개행 문자 제거

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="flex px-[8px] py-[4.5px] hover:bg-[#F4F4F4] group">
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
                <MiniProfile senderId={senderId} imgSrc={imgSrc} nickname={nickname} />
              </HoverCard>
            </div>
          ) : (
            <div className="flex flex-shrink-0 items-center justify-end text-xxs chat-time-stamp w-[36px] mr-[8px]">
              <div className="hidden group-hover:block">{time.split(" ")[1]}</div>
            </div>
          )}

          <div className="w-full m-[-12px 8px -16px -16px] p-[8px 8px 8px 16px]">
            {showProfile && (
              <div className="flex items-baseline space-x-1">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <span className="text-m-bold cursor-pointer hover:underline">{nickname}</span>
                  </HoverCardTrigger>
                  <MiniProfile senderId={senderId} imgSrc={imgSrc} nickname={nickname} />
                </HoverCard>

                <span className="text-xs chat-time-stamp">{time}</span>
              </div>
            )}
            {fileUrl && isImageFile(fileUrl) && <ImageWithModal fileUrl={fileUrl} />}
            {fileUrl && !isImageFile(fileUrl) && <FileDownload />}
            <div className="whitespace-pre-wrap break-words break-anywhere text-m">{text}</div>
          </div>
        </div>
      </ContextMenuTrigger>
      <MyContextMenu messageId={msgId} userId={senderId} />
    </ContextMenu>
  );
}
