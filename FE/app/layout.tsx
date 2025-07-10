"use client";
import "./globals.css";
import { notoSansKr, lato } from "./ui/fonts";
import { Toaster } from "sonner";

import { usePush } from "@/hooks/usePush";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  usePush();
  return (
    <html lang="en" className="h-full">
      <body className={`${notoSansKr.variable} ${lato.variable} h-screen overflow-hidden flex-col`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
