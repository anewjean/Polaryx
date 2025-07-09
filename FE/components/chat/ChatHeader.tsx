import { MessageCircle, StickyNote } from "lucide-react";
import { TabMembers } from "@/components/modal/TabMembers";

interface ChatHeaderProps {
  sectionId: number;
  tabName: string;
}

export function ChatHeader({ sectionId, tabName }: ChatHeaderProps) {
  return (
    <div>
      <div className="sticky top-0 bg-white">
        <div className="flex items-center h-[50px] px-[17px]">
          <div className="flex flex-1 justify-between items-center h-[30px] px-[3px]">
            <div className="flex items-center">
              {/* DM 탭만 프로필 이미지 표시 */}
              {sectionId === 4 && (
                <img
                  src="/user_default.png"
                  className="w-[24px] h-[24px] mr-[8px] rounded-md bg-gray-400 object-cover"
                />
              )}
              <p className="text-l">{tabName}</p>
            </div>
            <TabMembers />
          </div>
        </div>
        <div className="flex items-center h-[38px] px-[16px] border-b-2 gap-0">
          <div className="flex flex-fit items-center p-[6px] px-[6px] cursor-pointer hover:bg-[#F4F4F4] hover:rounded-t-md">
            <MessageCircle className="w-[16px] mr-[4px]" />
            <p className="text-center text-s-bold">Message</p>
          </div>
          <div className="flex flex-fit items-center p-[6px] px-[6px] cursor-pointer hover:bg-[#F4F4F4] hover:rounded-t-md">
            <StickyNote className="w-[16px] mr-[4px]" />
            <p className="text-center text-s-bold">Canvas</p>
          </div>
          <div className="flex flex-fit items-center p-[6px] px-[6px] cursor-pointer hover:bg-[#F4F4F4] hover:rounded-t-md"></div>
        </div>
      </div>
    </div>
  );
}
