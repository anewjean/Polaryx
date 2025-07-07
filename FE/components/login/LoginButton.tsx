"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export function LoginButton() {
  return (
    <div>
      <Button variant="outline" className="flex flex-row justify-center items-center gap-2 p-2" asChild>
        <Link href="http://localhost:8000/api/auth/google">
          <img src="./googleLogo.png" className="w-7" />
          <p className="text-xl">Google 계정으로 로그인하기</p>
        </Link>
      </Button>
    </div>
  );
}
