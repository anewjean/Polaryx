"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export function LoginButton() {
  return (
    <div>
      <Button asChild className="btn-google">
        <Link className="flex flex-row items-center" href="http://localhost:8000/auth/google">
          <img src="./googleLogo.png" className="w-6" />
          Google 로그인
        </Link>
      </Button>
    </div>
  );
}
