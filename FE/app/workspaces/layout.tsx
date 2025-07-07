"use client";

import "../globals.css";
import { Button } from "@/components/ui/button";

export default function WorkspacesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col w-full overflow-hidden">
      {/* 상단 바 */}
      <header className="flex h-11 items-center justify-between p-4 bg-black shadow-xl">
        <span className="font-bold text-xl text-white">SLAM</span>
        <div>
          <Button variant="link" size="sm" className="text-white">
            회원등록
          </Button>
        </div>
      </header>
      <main className="flex flex-1 min-h-0 overflow-hidden flex-row">{children}</main>
    </div>
  );
}
