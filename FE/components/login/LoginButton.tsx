"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export function LoginButton() {
  return (
    <div>
      <Button variant="outline" className="flex max-w-min py-7 px-10 cursor-pointer hover:bg-gray-300">
        <Link className="flex flex-row justify-center items-center gap-2 p-2" href="http://localhost:8000/api/auth/google">
          <img src="./googleLogo.png" className="flex w-10" />
          Google 로그인
        </Link>
      </Button>
    </div>
  );
}
