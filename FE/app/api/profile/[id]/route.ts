import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // 클라이언트가 보낸 쿼리스트링(예: requesterId)을 그대로 전달
  const query = request.nextUrl.searchParams.toString();

  // .env에 정의한 백엔드 주소를 사용
  const backendBase = process.env.BACKEND_BASE!;
  const url = `${backendBase}/api/profile/${params.id}?${query}`;

  // 실제 FastAPI로 프록시 요청
  const res = await fetch(url, {
    // 필요하다면 인증 토큰 헤더도 이곳에 추가 가능
    // headers: { Authorization: `Bearer ${token}` }
  });

  // 백엔드 응답 상태·본문을 그대로 Next.js 응답으로 반환
  const data = await res.text();  
  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": "application/json" }
  });
}
