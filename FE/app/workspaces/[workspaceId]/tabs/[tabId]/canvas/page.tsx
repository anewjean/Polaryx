"use client";

import "@/app/globals.css";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import SideMenu from "@/components/editor/Sidemenu";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import History from "@tiptap/extension-history";


export default function EditorPage() {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: {},
      }),
      History,
      // 나중에 History, BubbleMenu, CodeBlockLowlight 등 추가
    ],
    content: `
      <h1>새 문서</h1>
      <p>여기에 입력해보세요.</p>
    `,
    editorProps: {
      attributes: {
        class: 'prose mx-auto p-4 focus:outline-none',
      },
    },
  });

  return (
    <div className="flex min-h-screen bg-gray-50 p-6">
      {/* 1. SideMenu 호출 */}
      <SideMenu editor={editor} className="mr-4" />

      {/* 2. 에디터 본체 */}
      <Card className="flex-1 shadow-lg">
        <CardContent className="p-0">
          <EditorContent editor={editor} />
        </CardContent>
      </Card>
    </div>
  );
}