"use client";

import { MessageCircle, StickyNote, Link, Search } from "lucide-react";
import { TabMembers } from "@/components/modal/TabMembers";
import { useTabInfoStore } from "@/store/tabStore";
import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { getTabInfo } from "@/apis/tabApi";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

export function ChatHeader() {
  // 파라미터에서 workspaceId와 tabId 추출
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const workspaceId = params.workspaceId as string;
  const tabId = params.tabId as string;

  // 현재 활성화된 탭 확인 (message 또는 canvas 또는 link)
  const isCanvasActive = pathname.includes("/canvases");
  const isMessageActive = !isCanvasActive;
  const isLinkActive = pathname.includes("/link");

  // 탭 정보 가져오기
  const fetchTabInfo = useTabInfoStore((state) => state.fetchTabInfo);
  const tabInfo = useTabInfoStore((state) => state.tabInfoCache[tabId]);

  // 검색어 상태
  const [searchKeyword, setSearchKeyword] = useState("");

  //검색 실행
  const handleSearch = () => {
    if (!searchKeyword.trim()) return;
    router.push(
      `/workspaces/${workspaceId}/tabs/${tabId}/search?q=${encodeURIComponent(searchKeyword)}`,
    );
    setSearchKeyword("");
  };

  useEffect(() => {
    if (workspaceId && tabId) {
      fetchTabInfo(workspaceId, tabId);
    }
  }, [workspaceId, tabId, fetchTabInfo]);

  // 메시지 탭으로 이동
  const navigateToMessage = () => {
    router.push(`/workspaces/${workspaceId}/tabs/${tabId}`);
  };

  // 캔버스 탭으로 이동
  const navigateToCanvas = () => {
    router.push(
      `/workspaces/${workspaceId}/tabs/${tabId}/canvases/231bae03622f80679bfcfc9b96a0ff03`,
    );
  };

  // 링크 탭으로 이동
  const navigateToLink = () => {
    router.push(`/workspaces/${workspaceId}/tabs/${tabId}/links`);
  };

  return (
    <div className="sticky top-0 bg-white shadow-sm z-10">
      <div className="flex items-center h-[50px] px-[17px]">
        <div className="flex flex-1 justify-between items-center h-[30px] px-[3px]">
          <div className="flex items-center">
            {tabInfo?.tab_name ? (
              <p className="text-l">{tabInfo?.tab_name}</p>
            ) : (
              <p className="w-40 h-7 rounded-lg bg-[#F4F4F4]"></p> // 스켈레톤
            )}
          </div>
          
          <div className="flex flex-row items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search messages"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-7 w-48"
              />
            </div>
            <TabMembers />
            <Button
              variant="ghost"
              size="icon"
              className="flex items-center gap-1 px-7 hover:bg-gray-200"
            >
              <LogOut size={28} />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center gap-1 ml-4">
        {tabInfo?.section_id === 2 && (
          <div
            onClick={navigateToCanvas}
            className={cn(
              "flex flex-fit items-center p-[6px] px-[10px] cursor-pointer hover:bg-[#F4F4F4] hover:rounded-t-md",
              isCanvasActive &&
                "bg-[#F4F4F4] rounded-t-md border-b-2 border-black",
            )}
          >
            <StickyNote className="w-[16px] mr-[4px]" />
            <p className="text-center text-s-bold">Canvas</p>
          </div>
        )}

        <div
          onClick={navigateToMessage}
          className={cn(
            "flex flex-fit items-center p-[6px] px-[10px] cursor-pointer hover:bg-[#F4F4F4] hover:rounded-t-md",
            isMessageActive &&
              !isLinkActive &&
              "bg-[#F4F4F4] rounded-t-md border-b-2 border-black",
          )}
        >
          <MessageCircle className="w-[16px] mr-[4px]" />
          <p className="text-center text-s-bold">Message</p>
        </div>
        <div
          onClick={navigateToLink}
          className={cn(
            "flex flex-fit items-center p-[6px] px-[10px] cursor-pointer hover:bg-[#F4F4F4] hover:rounded-t-md",
            isLinkActive && "bg-[#F4F4F4] rounded-t-md border-b-2 border-black",
          )}
        >
          <Link className="w-[16px] mr-[4px]" />
          <p className="text-center text-s-bold">Link</p>
        </div>
      </div>
    </div>
  );
}
