import { MessageCircle, StickyNote } from "lucide-react";
import { TabMembers } from "@/components/modal/TabMembers";
import { useTabInfoStore } from "@/store/tabStore";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { getTabInfo } from "@/apis/tabApi";

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
      <div className="sticky top-0 bg-white">
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
              {tabInfo?.tab_name ? (
                <p className="text-l">{tabInfo?.tab_name}</p>
              ) : (
                <p className="w-40 h-7 rounded-lg bg-[#F4F4F4]"></p> // 스켈레톤
              )}
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
