"use client";
import { useRef, useState } from "react";
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
import { useMessageProfileStore } from "@/store/messageProfileStore";
import { putPresignedUrl, uploadFile } from "@/apis/fileImport";
import { useFileStore } from "@/store/fileStore";
import { useFilePreview } from "@/hooks/useFilePreview";
// import { Send } from "lucide-react";
// 실험용
import { jwtDecode } from "jwt-decode";
const TipTap = () => {
  const { message, setMessage, setSendFlag, setMessages, appendMessage } = useMessageStore();
  const { addProfile } = useMessageProfileStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  // 한글 조합 추적 플래그.
  const isComposingRef = useRef(false);
  // 중복 전송 방지 플래그.
  const editor = useEditor({
    editable: true,
    extensions: [
      StarterKit, // 핵심 확장 모음
      Placeholder.configure({
        // placeholder가 뭐임?
        placeholder: "나만무 team3",
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
            const parsedUrl = url.includes(":") ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`);
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
            const allowedProtocols = ctx.protocols.map((p) => (typeof p === "string" ? p : p.scheme));
            if (!allowedProtocols.includes(protocol)) {
              return false;
            }
            // disallowed domains
            const disallowedDomains = ["example-phishing.com", "malicious-site.net"];
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
            const parsedUrl = url.includes(":") ? new URL(url) : new URL(`https://${url}`);
            // only auto-link if the domain is not in the disallowed list
            const disallowedDomains = ["example-no-autolink.com", "another-no-autolink.com"];
            const domain = parsedUrl.hostname;
            return !disallowedDomains.includes(domain);
          } catch {
            return false;
          }
        },
      }),
    ],
    content: message,
  });
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
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    } catch (e) {
      alert((e as Error).message);
    }
  }, [editor]);
  const { handleFileSelect } = useFilePreview(editor, fileInputRef as React.RefObject<HTMLInputElement>);
  const addImage = useCallback(() => {
    fileInputRef.current?.click(); // 숨겨진 input 클릭
  }, []);
  const handleSend = async () => {
    console.log("handleSend"); // hack: 한글로만 한 줄 입력하면 이거 2번 실행됨
    ////////////////////////////////////////////////
    const token = localStorage.getItem("access_token");
    console.log(jwtDecode<{ user_id: string }>(token!).user_id);
    ////////////////////////////////////////////////
    const content = editor?.getText() || "";
    if (!content.trim()) return;
    // 메시지 전송 시 profile data 저장
    addProfile({
      nickname: "Dongseok Lee (이동석)",
      timestamp: new Date().getTime(),
      image: "/profileTest.png",
    });
    // appendMessage(content); // hack: 이 부분 어떻게 수정해야할 지 모르겠음
    setMessage(content); // 메시지 저장
    setSendFlag(true); // 전송 트리거
    editor?.commands.clearContent();
  };
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
            if (event.key === "Enter" && !event.shiftKey) {
              if (isComposingRef.current) return; // 한글 조합 중일 땐 무시
              event.preventDefault(); // 줄바꿈 방지
              handleSend();
            }
          }}
        />
        {/* <div className="flex flex-1 justify-end items-end">
          <Send size={20} />
        </div> */}
      </div>
    </div>
  );
};
export default TipTap;