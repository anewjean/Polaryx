import { MessageCircle, StickyNote } from "lucide-react";
import { TabMembers } from "@/components/modal/TabMembers";

export function ChatHeader() {
  return (
    <div>
      <div className="sticky top-0 z-20 bg-white">
        <div className="flex items-center h-[50px] px-[17px]">
          <div className="flex flex-1 justify-between items-center h-[30px] px-[3px]">
            <div className="flex items-center">
              {/* 추후 DM 탭만 프로필 이미지 표시 */}
              <img src="/user_default.png" className="w-[24px] h-[24px] mr-[8px] rounded-md bg-gray-400 object-cover" />
              <p className="text-l">어디갔어 이거</p>
            </div>
            <TabMembers />
          </div>
        </div>
        <div className="flex items-center h-[38px] px-[16px] border-b-2">
          <div className="flex items-center w-[72px] p-[8px] cursor-pointer hover:bg-[#F4F4F4] hover:rounded-t-md">
            <MessageCircle className="w-[16px] mr-[4px]" />
            <p className="text-center text-s-bold">메시지</p>
          </div>
          <div className="flex items-center w-[72px] p-[8px] cursor-pointer hover:bg-[#F4F4F4] hover:rounded-t-md">
            <StickyNote className="w-[16px] mr-[4px]" />
            <p className="text-center text-s-bold">캔버스</p>
          </div>
          <div className="flex items-center w-[72px] p-[8px] cursor-pointer hover:bg-[#F4F4F4] hover:rounded-t-md"></div>
        </div>
      </div>
    </div>
  );
}
