"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export function LoginButton() {
  return (
    <Button className="m-2 cursor-pointer" asChild>
      <Link href="http://localhost:8000/auth/google">Google Login</Link>
    </Button>
  );
}