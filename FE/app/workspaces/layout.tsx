"use client";
import "@/styles/globals.css";

import { Button } from "@/components/ui/button";
import { ExUpload } from "@/components/excel_import/exImportButton";
import { resetDB } from "@/apis/resetApi";
import SearchAutocomplete from "@/components/search/SearchAutocomplete";

export default function WorkspacesLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex h-full flex-col w-full overflow-hidden">
      {/* 상단 바 */}
      <header className="flex h-11 items-center justify-between p-4 bg-black shadow-xl">
        <span className="font-bold text-xl text-white">Polaris</span>
        <div className="flex flex-row items-center gap-2">
          <SearchAutocomplete />               
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