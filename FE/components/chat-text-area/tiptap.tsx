"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import "./styles.scss";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Dropcursor from "@tiptap/extension-dropcursor";
import Image from "@tiptap/extension-image";
import CodeBlock from "@tiptap/extension-code-block";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import Code from "@tiptap/extension-code";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Blockquote from "@tiptap/extension-blockquote";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Strike from "@tiptap/extension-strike";
import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import ToolBar from "./toolbar";
import { useMessageStore } from "@/store/messageStore";
import { useFilePreview } from "@/hooks/useFilePreview";
import { useParams } from "next/navigation";
import { useFetchMessages } from "@/hooks/useFetchMessages";
import { useTabInfoStore } from "@/store/tabStore";
import { Extension } from "@tiptap/core";
import { Skeleton } from "@/components/ui/skeleton";
import { LinkDialog } from "./LinkDialog";
import { BookmarkPlus, BookmarkX } from "lucide-react";
import SaveMessages from "./SaveMessages";

// Shift+Enter을 Enter처럼 동작시키는 커스텀 확장
const CustomEnter = Extension.create({
  name: "custom-enter",
  addKeyboardShortcuts() {
    return {
      "Shift-Enter": () => true,
      Enter: () => true,
    };
  },
});

export function TipTap() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const tabId = params.tabId as string;
  const fetchTabInfo = useTabInfoStore((state) => state.fetchTabInfo);
  const tabInfo = useTabInfoStore((state) => state.tabInfoCache[tabId]);
  const [mounted, setMounted] = useState(false);

  // 링크 다이얼로그 상태
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  // 팝오버 트리거
  const [openPopover, setOpenPopover] = useState(false);

  // 클라이언트에서만 mounted = true
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (workspaceId && tabId) {
      fetchTabInfo(workspaceId, tabId);
    }
  }, [workspaceId, tabId, fetchTabInfo]);
  useFetchMessages(workspaceId, tabId);

  const { message, setMessage, setSendFlag, setMessages, appendMessage } =
  useMessageStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  // 한글 조합 추적 플래그.
  const isComposingRef = useRef(false);
  // 중복 전송 방지 플래그.

  const editor = useEditor(
    {
      // immediatelyRender: false 제거해도 됨
      editable: true,
      extensions: [
        StarterKit, // 핵심 확장 모음
        Placeholder.configure({
          // placeholder가 뭐임?
          placeholder: `${tabInfo?.tab_name}에 메시지 보내기`,
        }),
        Document,
        Paragraph,
        Text,
        Blockquote,
        Bold,
        Italic,
        Strike,
        Code,
        ListItem,
        OrderedList,
        BulletList,
        CodeBlock,
        Dropcursor,
        Image,
        Link.configure({
          openOnClick: true, // 링크 클릭 시 이동 가능
          autolink: true,
          defaultProtocol: "https",
          protocols: ["http", "https"],
          isAllowedUri: (url, ctx) => {
            try {
              // URL 파싱
              const parsedUrl = url.includes(":")
                ? new URL(url)
                : new URL(`${ctx.defaultProtocol}://${url}`);

              // 기본 검증 (XSS 방어 등) 통과하는지 확인
              if (!ctx.defaultValidate(parsedUrl.href)) {
                return false;
              }

              // 금지 프로토콜 차단
              const disallowedProtocols = ["ftp", "file", "mailto"];
              const protocol = parsedUrl.protocol.replace(":", "");
              if (disallowedProtocols.includes(protocol)) {
                return false;
              }

              // 허용 프로토콜 검증
              const allowedProtocols = ctx.protocols.map((p) =>
                typeof p === "string" ? p : p.scheme,
              );
              if (!allowedProtocols.includes(protocol)) {
                return false;
              }

              // 금지 도메인 차단
              const disallowedDomains = [
                "example-phishing.com", // 예시 1
                "malicious-site.net", // 예시 2
              ];

              const domain = parsedUrl.hostname;
              if (disallowedDomains.includes(domain)) {
                return false;
              }

              // 모든 검증 통과 시
              return true;
            } catch {
              return false;
            }
          },

          // 오토 링크 처리 여부를 결정 (위랑 중복 아님)
          shouldAutoLink: (url) => {
            try {
              const parsedUrl = url.includes(":")
                ? new URL(url)
                : new URL(`https://${url}`);

              const disallowedDomains = [
                "example-no-autolink.com",
                "another-no-autolink.com",
              ];
              const domain = parsedUrl.hostname;
              return !disallowedDomains.includes(domain);
            } catch {
              return false;
            }
          },
        }),
        CustomEnter, // 커스텀 확장 추가
      ],
      content: message,
    },
    [tabInfo?.tab_name],
  );

  // 메시지 전송 후에도 채팅이 남아있는 문제 해결을 위한 초기화
  // 탭이 바뀔 때마다 입력창을 비워줌
  useEffect(() => {
    if (editor) {
      editor.commands.clearContent();
    }
  }, [tabId, editor]);

  // 링크 다이얼로그 열기
  const openLinkDialog = useCallback(() => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, " ") || "";
    const previousUrl = editor.getAttributes("link").href || "";
    setLinkText(selectedText);
    setLinkUrl(previousUrl);
    setIsLinkDialogOpen(true);
  }, [editor]);

  const setLink = useCallback(
    (text: string, url: string) => {
      if (!editor) return;

      // 기존 링크 해제
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      // 빈 URL이면 그냥 닫기
      if (!url.trim()) {
        setIsLinkDialogOpen(false);
        return;
      }

      // 프로토콜이 없으면 https:// 붙이기
      const href = /^https?:\/\//.test(url) ? url : `https://${url}`;
      const { from, to } = editor.state.selection;

      // 선택 영역이 있으면 대체, 없으면 삽입
      if (from !== to) {
        editor
          .chain()
          .focus()
          .deleteRange({ from, to })
          .insertContentAt(from, {
            type: "text",
            text: linkText,
            marks: [{ type: "link", attrs: { href } }],
          })
          .run();
      } else {
        editor
          .chain()
          .focus()
          .insertContentAt(from, {
            type: "text",
            text: text,
            marks: [{ type: "link", attrs: { href } }],
          })
          .run();
      }

      setIsLinkDialogOpen(false);
    },
    [editor],
  );

  const { handleFileSelect } = useFilePreview(
    editor,
    fileInputRef as React.RefObject<HTMLInputElement>,
  );
  const addImage = useCallback(() => {
    fileInputRef.current?.click(); // 숨겨진 input 클릭
  }, []);

  const handleSend = async () => {
    let content = editor?.getHTML() || "";
    console.log(content);

    // 빈 <p></p>, <p><br></p>, <li><p></p></li>, <li><p><br></p></li> 반복적으로 제거
    let prev;
    do {
      prev = content;
      content = content
        .replace(/(?:<p>(?:<br>)?<\/p>)+$/g, "") // 빈 단락
        .replace(/<li><p>(?:<br>)?<\/p><\/li>/g, "") // 빈 리스트 항목
        .replace(/<br\s*\/?>/g, ""); // 남아있는 <br> 모두 제거
    } while (content !== prev);

    if (!content.trim()) return;
    setMessage(content);
    setSendFlag(true);
    editor?.commands.clearContent();
  };

  // 서버사이드에서는 아무것도 렌더링하지 않음
  // 스켈레톤 이미지 (로딩중일 때 보여줌)
  if (!mounted) {
    return (
      <div className="chat-text-area border border-gray-300 rounded-[7px]">
        <input style={{ display: "none" }} />
        {/* 툴바 스켈레톤 */}
        <div className="toolbar-container rounded-t-[7px] px-[15px] pt-[5px] pb-0 bg-[#f5f5f5]">
          <div className="flex gap-2">
            {/* 툴바 버튼 5개 정도 */}
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-9 h-9 rounded-md" />
            ))}
          </div>
        </div>
        {/* 에디터 스켈레톤 */}
        <div className="editor-container flex px-[15px] py-[10px]">
          <Skeleton className="h-6 w-[20%] rounded-md" />
        </div>
      </div>
    );
  }

  if (!editor) {
    return null;
  }
  return (
    <div className="chat-text-area">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
      <div className="flex justify-between items-center toolbar-container rounded-t-[7px]">
        <ToolBar editor={editor} setLink={openLinkDialog} addImage={addImage} />
        {/* 북마크 버튼 누르면 팝오버 열기 */}
        <SaveMessages workspaceId={workspaceId} openPopover={openPopover} setOpenPopover={setOpenPopover}>
          {openPopover ? (
            // 팝오버가 열려있으면, 회색의 엑스 버튼 보여줌
            <BookmarkX onClick={() => setOpenPopover(false)} className="mb-1.5 w-5.5 h-5.5 cursor-pointer text-gray-400" />
          ) : (
            // 팝오버가 닫혀있으면, 파란색의 플러스 버튼 보여줌
            <BookmarkPlus onClick={() => setOpenPopover(true)} className="mb-1.5 w-5.5 h-5.5 cursor-pointer text-blue-300" />
          )}
        </SaveMessages>
      </div>

      {/* 링크 추가 다이얼로그 */}
      <LinkDialog
        isOpen={isLinkDialogOpen}
        onOpenChange={setIsLinkDialogOpen}
        onSave={setLink}
      ></LinkDialog>

      <div className="editor-container flex">
        <EditorContent
          editor={editor}
          className="w-full"
          // 한글 조합 추적.
          onCompositionStart={() => {
            isComposingRef.current = true;
          }}
          onCompositionEnd={() => {
            isComposingRef.current = false;
          }}
          /////////////// 추가 ///////////////
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              if (isComposingRef.current) return;
              event.preventDefault();
              if (event.shiftKey) {
                if (
                  // 리스트 안이면 새 리스트 항목
                  editor.isActive("bulletList") ||
                  editor.isActive("orderedList")
                ) {
                  editor.commands.splitListItem("listItem");
                } else if (editor.isActive("codeBlock")) {
                  // 코드블록 안이면 줄바꿈
                  editor.commands.newlineInCode();
                } else {
                  // 아니면 새 단락
                  editor.commands.splitBlock();
                }
              } else {
                handleSend();
              }
            }
          }}
        />
        {/* <div className="flex flex-1 justify-end items-end">
          <Send size={20} />
        </div> */}
      </div>
    </div>
  );
}
export default TipTap;
