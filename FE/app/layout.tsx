import "./globals.css";
import { notoSansKr, lato } from "./ui/fonts";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${notoSansKr.variable} ${lato.variable} h-screen overflow-hidden flex-col`}>{children}</body>
    </html>
  );
}
