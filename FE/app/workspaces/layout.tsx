"use client";
import "@/styles/globals.css";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExUpload } from "@/components/excel_import/exImportButton";
import { resetDB } from "@/apis/resetApi";
import { Search } from "lucide-react";
export default function WorkspacesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const handleSearch = () => {
    if (!keyword.trim()) return;
    router.push(`/workspaces/${workspaceId}/search?q=${encodeURIComponent(keyword)}`);
    setKeyword("");
  };

  return (
    <div className="flex h-full flex-col w-full overflow-hidden">
      {/* 상단 바 */}
      <header className="flex h-11 items-center justify-between p-4 bg-black shadow-xl">
        <span className="font-bold text-xl text-white">Polaris</span>
        <div className="flex flex-row items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-7 w-48 bg-gray-700 text-white border-gray-600"
            />
          </div>
          <ExUpload />
          <Button
            variant="destructive"
            onClick={resetDB}
            className="cursor-pointer"
          >
            Reset DB
          </Button>
        </div>
      </header>
      <main className="flex flex-1 min-h-0 overflow-hidden flex-row break-all">
        {children}
      </main>
    </div>
  );
}