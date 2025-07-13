"use client";
import "@/styles/globals.css";
import { notoSansKr, lato } from "./ui/fonts";
import { Toaster } from "sonner";
import { useMyUserStore } from "@/store/myUserStore";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // app/layout.tsx에서 useEffect 사용
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = jwtDecode<{ user_id: string }>(token);
        useMyUserStore.getState().setUserId(decoded.user_id);
        console.log("decoded.user_id: ", decoded.user_id);
      } catch (error) {
        console.error("토큰 디코딩 실패:", error);
      }
    }
  }, []); // 빈 의존성 배열 = 컴포넌트 마운트 시 한 번만 실행
  return (
    <html lang="en" className="h-full">
      <body
        className={`${notoSansKr.variable} ${lato.variable} h-screen overflow-hidden flex-col`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
