// app/auth/callback/page.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("토큰이 없습니다.");
      return;
    }
    localStorage.setItem("accessToken", token);
    router.replace("/client/workspaceId");
  }, [token, router]);

  if (error) {
    return <p>로그인 실패: {error}</p>;
  }
  return <p>로그인 처리 중입니다… 잠시만 기다려 주세요.</p>;
}
