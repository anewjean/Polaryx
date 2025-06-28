"use client";
import "../globals.css";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 min-h-0 flex-col w-full">
      {/* 상단 바 */}
      <header className="flex h-11 flex justify-left items-center p-4 bg-black shadow-xl">
        <span className="font-bold text-xl text-white">SLAM</span>
      </header>
      <main className="flex flex-1 min-h-0 flex-row">{children}</main>
    </div>
  );
}
