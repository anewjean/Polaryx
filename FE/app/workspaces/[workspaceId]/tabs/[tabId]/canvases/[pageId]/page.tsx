"use client";

import { use, useState, useEffect } from "react"
import NotionPage from "@/components/canvas/NotionPage"

export default function Page({ params }: { params: Promise<{ pageId: string }> }) {
  const { pageId } = use(params)
  const [recordMap, setRecordMap] = useState<any>(null)

  useEffect(() => {
    async function fetchPage() {
      const res = await fetch(`https://notion-api.splitbee.io/v1/page/${pageId}`)
      const json = await res.json()
      const recordMap = {
        block: json,
        collection: {},
        collection_view: {},
        space: {},
        notion_user: {},
        signed_urls: {}
      }
      setRecordMap(recordMap)
    }
    fetchPage()
  }, [pageId])

  if (!recordMap) {
    return <div>페이지를 찾을 수 없습니다.</div>
  }
  return <NotionPage recordMap={recordMap}/>    
}
