"use client";

import { useState, useEffect } from "react"
import NotionPage from "@/components/canvas/NotionPage"
import { useParams } from "next/navigation";
import { ExtendedRecordMap } from 'notion-types';

// Notion API 응답을 ExtendedRecordMap 형식으로 변환하는 함수
function convertToExtendedRecordMap(notionData: any): ExtendedRecordMap {
  // collection_query가 필요하지만 없으니 빈 객체로 추가
  return {
    block: notionData,
    collection: {},
    collection_view: {},
    collection_query: {},
    space: {},
    notion_user: {},
    signed_urls: {}
  } as unknown as ExtendedRecordMap; // 타입 변환을 위해 unknown으로 먼저 변환
}

export default function Page() {
  const params = useParams();
  const canvasId = params.canvasId as string;
  
  const [recordMap, setRecordMap] = useState<ExtendedRecordMap | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchPage() {
      try {             
        // 테스트 ID 사용 (Notion 공개 페이지 ID)
        // 실제 사용 시 canvasId 사용
        const testId = "231bae03622f80679bfcfc9b96a0ff03";
        const apiUrl = `https://notion-api.splitbee.io/v1/page/${testId}`;
        
        console.log("API 요청 URL:", apiUrl);
        const res = await fetch(apiUrl);
        
        if (!res.ok) {
          throw new Error(`API 응답 오류: ${res.status}`);
        }
        
        const json = await res.json();
        console.log("API 응답 받음", Object.keys(json).length > 0 ? "데이터 있음" : "데이터 없음");
        
        // Notion API 응답을 ExtendedRecordMap 형식으로 변환
        const extendedRecordMap = convertToExtendedRecordMap(json);
        setRecordMap(extendedRecordMap);
        setError(null);
      } catch (err) {
        console.error("Canvas 불러오기 오류:", err);
        setError(`캔버스를 불러오는 중 오류가 발생했습니다: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPage();
  }, [canvasId]);

  if (loading) {
    return (
    <div className="flex items-center justify-center w-full h-full">
      <p>캔버스 로딩 중...</p>
    </div>);
  }
  
  if (error) {
    return <div className="flex items-center justify-center h-full">
      <p className="text-red-500">{error}</p>
    </div>;
  }

  if (!recordMap) {
    return <div className="flex items-center justify-center h-full">
      <p>캔버스를 찾을 수 없습니다.</p>
    </div>;
  }
  
  return <NotionPage recordMap={recordMap} />;
}
