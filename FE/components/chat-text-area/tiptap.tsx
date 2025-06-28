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

const TipTap = () => {
  const [text, setText] = useState("helloWorld");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editor = useEditor({
    editable: true,
    extensions: [
      StarterKit,
      Placeholder.configure({
        // Use a placeholder:
        placeholder: "나만무 team3",
        // Use different placeholders depending on the node type:
        // placeholder: ({ node }) => {
        //   if (node.type.name === 'heading') {
        //     return 'What's the title?'
        //   }

        //   return 'Can you add some further context?'
        // },
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
    content: text,
  });

  const setLink = useCallback(() => {
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
      alert(e.message);
    }
  }, [editor]);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && editor) {
        // 파일 크기 제한 (5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert("파일 크기는 5MB 이하여야 합니다.");
          return;
        }

        // 파일을 base64로 변환
        const base64 = await convertFileToBase64(file);

        // 에디터에 이미지 삽입
        if (file.type.startsWith("image/")) {
          editor.chain().focus().setImage({ src: base64 }).run();
        } else {
          const ext = file.name.split(".").pop()?.toLowerCase() || "";

          let defaultImg = "/upload_default.png"; // 기본값

          if (ext === "pdf") defaultImg = "/upload_default.png";
          else if (["doc", "docx"].includes(ext)) defaultImg = "/upload_default.png";
          else if (["xls", "xlsx"].includes(ext)) defaultImg = "/upload_default.png";
          else if (["ppt", "pptx"].includes(ext)) defaultImg = "/upload_default.png";

          editor.chain().focus().setImage({ src: defaultImg }).run();
        }

        // 파일 입력 초기화
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [editor],
  );

  const addImage = useCallback(() => {
    fileInputRef.current?.click(); // 숨겨진 input 클릭
  }, []);

  const handleSend = () => {
    // 메시지 전송 로직 (예: 서버로 전송, 상태 초기화 등)
    alert("메시지 전송!");
    // editor.commands.clearContent(); // 필요시 입력창 비우기
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
      <div className="toolbar-container">
        <ToolBar editor={editor} setLink={setLink} addImage={addImage} />
      </div>
      <div className="editor-container">
        <EditorContent
          editor={editor}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault(); // 줄바꿈 방지
              handleSend();
            }
          }}
        />
      </div>
    </div>
  );
};

export default TipTap;
