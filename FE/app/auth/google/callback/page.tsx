"use client";

import { Suspense } from "react";
import AuthCallbackPage from "./AuthCallbackPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">로그인 처리 중...</div>}>
      <AuthCallbackPage />
    </Suspense>
  );
}
