"use client";
import { useRef, useState, useEffect } from "react";
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
import React, { useCallback } from "react";
import ToolBar from "./toolbar";
import { useMessageStore } from "@/store/messageStore";
// import { useMessageProfileStore } from "@/store/messageProfileStore";
// import { putPresignedUrl, uploadFile } from "@/apis/fileImport";
// import { useFileStore } from "@/store/fileStore";
import { useFilePreview } from "@/hooks/useFilePreview";
import { useParams } from "next/navigation";
import { getTabInfo } from "@/apis/tabApi";
import { useFetchMessages } from "@/hooks/useFetchMessages";
// import { Send } from "lucide-react";
// 실험용
import { jwtDecode } from "jwt-decode";
import { Extension } from "@tiptap/core";

// Shift+Enter을 Enter처럼 동작시키는 커스텀 확장
const CustomEnter = Extension.create({
  name: "custom-enter",
  addKeyboardShortcuts() {
    return {
      "Shift-Enter": () => true,
      "Enter": () => true,
    };
  },
});

export function TipTap() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const tabId = params.tabId as string;

  const [tabName, setTabName] = useState<string>(""); // 탭 이름
  const [mounted, setMounted] = useState(false);

  // 클라이언트에서만 mounted = true
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!workspaceId || !tabId) return;

    (async () => {
      try {
        const info = await getTabInfo(workspaceId, tabId);
        setTabName(info.tab_name); // tab_name 불러오기
      } catch (e) {
        console.log("탭 정보 조회 실패:", e);
      }
    })();
  }, [workspaceId, tabId]);
  useFetchMessages(workspaceId, tabId);

  const { message, setMessage, setSendFlag, setMessages, appendMessage } =
    useMessageStore();
  // const { addProfile } = useMessageProfileStore();
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
          placeholder: `${tabName}에 메시지 보내기`,
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
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
          protocols: ["http", "https"],
          isAllowedUri: (url, ctx) => {
            try {
              // construct URL
              const parsedUrl = url.includes(":")
                ? new URL(url)
                : new URL(`${ctx.defaultProtocol}://${url}`);
              // use default validation
              if (!ctx.defaultValidate(parsedUrl.href)) {
                return false;
              }
              // disallowed protocols
              const disallowedProtocols = ["ftp", "file", "mailto"];
              const protocol = parsedUrl.protocol.replace(":", "");
              if (disallowedProtocols.includes(protocol)) {
                return false;
              }
              // only allow protocols specified in ctx.protocols
              const allowedProtocols = ctx.protocols.map((p) =>
                typeof p === "string" ? p : p.scheme,
              );
              if (!allowedProtocols.includes(protocol)) {
                return false;
              }
              // disallowed domains
              const disallowedDomains = [
                "example-phishing.com",
                "malicious-site.net",
              ];
              const domain = parsedUrl.hostname;
              if (disallowedDomains.includes(domain)) {
                return false;
              }
              // all checks have passed
              return true;
            } catch {
              return false;
            }
          },
          shouldAutoLink: (url) => {
            try {
              // construct URL
              const parsedUrl = url.includes(":")
                ? new URL(url)
                : new URL(`https://${url}`);
              // only auto-link if the domain is not in the disallowed list
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
    [tabName],
  );

  // 메시지 전송 후에도 채팅이 남아있는 문제 해결을 위한 초기화
  // 탭이 바뀔 때마다 입력창을 비워줌
  useEffect(() => {
    if (editor) {
      editor.commands.clearContent();
    }
  }, [tabId, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    // cancelled
    if (url === null) {
      return;
    }
    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    // update link
    try {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } catch (e) {
      alert((e as Error).message);
    }
  }, [editor]);

  const { handleFileSelect } = useFilePreview(
    editor,
    fileInputRef as React.RefObject<HTMLInputElement>,
  );
  const addImage = useCallback(() => {
    fileInputRef.current?.click(); // 숨겨진 input 클릭
  }, []);

const handleSend = async () => {
  let content = editor?.getHTML() || "";

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
  if (!mounted) {
    return <div className="chat-text-area">Loading...</div>;
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
      <div className="toolbar-container rounded-t-[7px]">
        <ToolBar editor={editor} setLink={setLink} addImage={addImage} />
      </div>
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
                // 리스트 안이면 새 리스트 항목, 아니면 새 단락
                if (editor.isActive("bulletList") || editor.isActive("orderedList")) {
                  editor.commands.splitListItem("listItem");
                } else {
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
