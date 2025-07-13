import { MessageCircle, StickyNote } from "lucide-react";
import { TabMembers } from "@/components/modal/TabMembers";
import { useTabInfoStore } from "@/store/tabStore";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { getTabInfo } from "@/apis/tabApi";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

export function ChatHeader() {
  // 파라미터에서 workspaceId와 tabId 추출
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const tabId = params.tabId as string;

  // 탭 정보 가져오기
  const fetchTabInfo = useTabInfoStore((state) => state.fetchTabInfo);
  const tabInfo = useTabInfoStore((state) => state.tabInfoCache[tabId]);

  useEffect(() => {
    if (workspaceId && tabId) {
      fetchTabInfo(workspaceId, tabId);
    }
  }, [workspaceId, tabId, fetchTabInfo]);

  return (
    <div>
      <div className="sticky top-0 bg-white shadow-sm z-1">
        <div className="flex items-center h-[50px] px-[17px]">
          <div className="flex flex-1 justify-between items-center h-[30px] px-[3px]">
            <div className="flex items-center">
              {/* DM 탭만 프로필 이미지 표시 */}
              {/* {sectionId === 4 && (
                <img
                  src="/user_default.png"
                  className="w-[24px] h-[24px] mr-[8px] rounded-md bg-gray-400 object-cover"
                />
              )} */}
              <p className="text-l">{tabInfo?.tab_name}</p>
            </div>
            <div className="flex flex-row items-center gap-0">
              <TabMembers />
              <Button variant="ghost" size="icon" className="flex items-center gap-1 px-7 hover:bg-gray-200">
                <LogOut size={28} />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center h-[38px] px-[12px] border-b-1 gap-0">
          <div className="flex flex-fit items-center p-[6px] px-[10px] cursor-pointer hover:bg-[#F4F4F4] hover:rounded-t-md">
            <MessageCircle className="w-[16px] mr-[4px]" />
            <p className="text-center text-s-bold">Message</p>
          </div>
          <div className="flex flex-fit items-center p-[6px] px-[10px] cursor-pointer hover:bg-[#F4F4F4] hover:rounded-t-md">
            <StickyNote className="w-[16px] mr-[4px]" />
            <p className="text-center text-s-bold">Canvas</p>
          </div>
          <div className="flex flex-fit items-center p-[6px] px-[10px] cursor-pointer hover:bg-[#F4F4F4] hover:rounded-t-md"></div>
        </div>
      </div>
    </div>
  );
}
