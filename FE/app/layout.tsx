"use client";
import "@/styles/globals.css";
import "../styles/prosemirror.css";
import { notoSansKr, lato } from "./ui/fonts";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${notoSansKr.variable} ${lato.variable} h-screen overflow-hidden flex-col`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
