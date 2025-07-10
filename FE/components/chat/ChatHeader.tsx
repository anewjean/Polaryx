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

  // 탭 정보 캐시에서 가져오기
  const tabInfoCache = useTabInfoStore((state) => state.tabInfoCache);
  const setTabInfo = useTabInfoStore((state) => state.setTabInfo);
  const tabInfo = tabInfoCache[tabId];

  useEffect(() => {
    if (workspaceId && tabId && !tabInfo) {
      (async () => {
        getTabInfo(workspaceId, tabId)
          .then((info) => {
            setTabInfo(tabId, info); // 캐시에 정보 저장
          })
          .catch((e) => {
            console.log("탭 정보 조회 실패:", e);
          });
      })();
    }
  }, [workspaceId, tabId, tabInfo]);

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
              <p className="text-l">{tabInfo?.tab_name}</p>
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
