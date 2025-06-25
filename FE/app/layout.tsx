"use client";

import "./globals.css";

export default function ClientLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
