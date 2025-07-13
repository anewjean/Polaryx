import { useRef, useEffect } from "react";
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
import { Extension } from "@tiptap/core";
import ToolBar from "../chat-text-area/toolbar";
import { useFilePreview } from "@/hooks/useFilePreview";
import "../chat-text-area/styles.scss";

interface ChatEditTiptapProps {
  initialContent: string;
  onSave: (content: string) => void;
  onCancel: () => void;
}

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

export default function ChatEditTiptap({ initialContent, onSave, onCancel }: ChatEditTiptapProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isComposingRef = useRef(false);

  const editor = useEditor({
    editable: true,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: initialContent }),
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
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`${ctx.defaultProtocol}://${url}`);
            if (!ctx.defaultValidate(parsedUrl.href)) return false;
            const disallowedProtocols = ["ftp", "file", "mailto"];
            const protocol = parsedUrl.protocol.replace(":", "");
            if (disallowedProtocols.includes(protocol)) return false;
            const allowedProtocols = ctx.protocols.map((p) =>
              typeof p === "string" ? p : p.scheme
            );
            if (!allowedProtocols.includes(protocol)) return false;
            const disallowedDomains = [
              "example-phishing.com",
              "malicious-site.net",
            ];
            const domain = parsedUrl.hostname;
            if (disallowedDomains.includes(domain)) return false;
            return true;
          } catch {
            return false;
          }
        },
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
      CustomEnter,
    ],
    content: initialContent,
  });

  const { handleFileSelect } = useFilePreview(
    editor,
    fileInputRef as React.RefObject<HTMLInputElement>
  );
  const addImage = () => {
    fileInputRef.current?.click();
  };

  // 링크 삽입
  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    try {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    } catch (e) {
      alert((e as Error).message);
    }
  };

  // Save handler
  const handleSave = () => {
    let content = editor?.getHTML() || "";
    // 빈 <p></p>, <p><br></p>, <li><p></p></li>, <li><p><br></p></li> 반복적으로 제거
    let prev;
    do {
      prev = content;
      content = content
        .replace(/(?:<p>(?:<br>)?<\/p>)+$/g, "")
        .replace(/<li><p>(?:<br>)?<\/p><\/li>/g, "")
        .replace(/<br\s*\/?>(?![^<]*<)/g, "");
    } while (content !== prev);
    if (!content.trim()) return;
    onSave(content);
  };

  // ESC로 취소
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  if (!editor) return null;

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
      <div className="editor-container flex items-center bg-white">
        <EditorContent
          editor={editor}
          className="w-full"
          onCompositionStart={() => {
            isComposingRef.current = true;
          }}
          onCompositionEnd={() => {
            isComposingRef.current = false;
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              if (isComposingRef.current) return;
              event.preventDefault();
              handleSave();
            }
            if (event.key === "Escape") {
              event.preventDefault();
              onCancel();
            }
          }}
        />
        <div className="flex gap-2 ml-2">
          <button
            onClick={onCancel}
            className="w-13 h-8 px-3 py-1 rounded-md bg-white border-1 border-[#E5E5E5] text-black cursor-pointer text-s-bold hover:bg-[#F5F5F5]"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="w-13 h-8 px-3 py-1 rounded-md bg-[#171717] text-white cursor-pointer text-s-bold"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
