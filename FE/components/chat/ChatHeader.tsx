import { MessageCircle, StickyNote } from "lucide-react";

export function ChatHeader() {
  return (
    <>
      <div className="flex items-center h-[50px] px-[17px]">
        <div className="flex items-center h-[30px] px-[3px] cursor-pointer hover:bg-[#F4F4F4] hover:rounded-md">
          <img src="/jungler.png" className="w-[24px] h-[24px] mr-[8px] rounded-md" />
          <p className="text-l">Dongseok Lee (이동석)</p>
        </div>
      </div>
      <div className="flex items-center h-[38px] px-[10px] border-b-2">
        <div className="flex items-center w-[120px] p-[5px] cursor-pointer hover:bg-[#F4F4F4] hover:rounded-t-md">
          <StickyNote className="w-[16px] mr-[4px]" />
          <p className="text-center text-s-bold">메시지</p>
        </div>
        <div className="flex items-center w-[120px] p-[5px] cursor-pointer hover:bg-[#F4F4F4] hover:rounded-t-md">
          <StickyNote className="w-[16px] mr-[4px]" />
          <p className="text-center text-s-bold">학습 자료</p>
        </div>
        <div className="flex items-center w-[120px] p-[5px] cursor-pointer hover:bg-[#F4F4F4] hover:rounded-t-md">
          <StickyNote className="w-[16px] mr-[4px]" />
          <p className="text-center text-s-bold">링크 추가</p>
        </div>
      </div>
    </>
  );
}
