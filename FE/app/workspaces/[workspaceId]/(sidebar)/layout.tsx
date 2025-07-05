"use client";

import React from "react";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  console.log("👉 SidebarLayout 렌더");
  return <>{children}</>;
}
