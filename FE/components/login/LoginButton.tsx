"use client";

const BASE = process.env.NEXT_PUBLIC_BASE;

import Link from "next/link";

import { Button } from "@/components/ui/button";

export function LoginButton() {
  return (
    <div>
      <Button
        variant="outline"
        className="flex border-1 border-gray-400 bg-background/1 text-white max-w-min py-7 px-10 cursor-pointer hover:bg-gray-800 hover:text-gray-200"
      >
        <Link
          className="flex flex-row justify-center items-center gap-2 p-2"
          href={`${BASE}/api/auth/google`}
        >
          <img src="./googleLogo.png" className="flex w-6" alt="Google Logo" />
          <span className="text-lg">Google 로그인</span>
        </Link>
      </Button>
    </div>
  );
}
