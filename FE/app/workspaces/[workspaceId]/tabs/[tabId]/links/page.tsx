"use client";

import LinkTable from "@/components/link/linkTable";
import AddLinkButton from "@/components/link/addLinkButton";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const tabId = params.tabId as string;

  return (
    <div className="px-30 py-8 bg-gray-100 h-full">
      <div className="flex flex-row items-center justify-between mb-5 pl-4">
        <div className="text-xl">링크</div>
        <AddLinkButton workspaceId={workspaceId} tabId={tabId} />
      </div>
      <LinkTable workspaceId={workspaceId} tabId={tabId} />
    </div>
  );
}