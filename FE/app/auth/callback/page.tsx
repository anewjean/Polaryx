"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

type JWTPayload = { email: string; exp: number };
type Workspace = {
    id: string;
    name: string;
    
}
export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");
  const errorParam = params.get("error");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // 백엔드에서 ?error=some_code 로 왔을 때
    if (errorParam) {
      setError(errorParam === "not_found" ? "등록된 사용자가 아닙니다." : "알 수 없는 오류가 발생했습니다.");
      setIsLoading(false);
      return;
    }

    // 정상 flow: token 이 없으면 에러
    if (!token) {
      setError("토큰이 없습니다.");
      setIsLoading(false);
      return;
    }

    // 성공 flow
    localStorage.setItem("accessToken", token);

    try {
      const decoded = jwtDecode<JWTPayload>(token);
      setEmail(decoded.email);
    } catch {
      setError("토큰 복호화에 실패했습니다.");
    }

    setIsLoading(false);

    setTimeout(() => {
      router.replace("/client/workspaceId"); // fetch +  해서 찾고
    }, 1500);
  }, [token, errorParam, router]);

  // error 상태가 있으면 실패 UI를 띄운다
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-2">로그인 실패</h1>
        <p className="mb-6 text-red-600">{error}</p>
        <button onClick={() => router.push("/")} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          홈으로 가기
        </button>
      </div>
    );
  }

  // 로딩 중 UI
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="w-12 h-12 border-4 border-t-blue-400 border-gray-600 rounded-full animate-spin mb-4" />
        <div className="text-lg">
          <p>로그인 처리 중입니다</p>
        </div>
      </div>
    );
  }

  // (리다이렉트가 성공적으로 호출되면 이 라인은 거의 타지 않습니다)
  return null;
}
