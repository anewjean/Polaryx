"use client";

import { notoSansKr, lato } from "./ui/fonts"; // 글꼴
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${notoSansKr.variable} ${lato.variable} min-h-screen flex flex-col`}>{children}</body>
    </html>
  );
}
