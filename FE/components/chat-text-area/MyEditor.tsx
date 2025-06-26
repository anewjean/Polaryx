import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { Link } from "@tiptap/extension-link";
import { LinkPopover } from "../tiptap-ui/link-popover";
import { ListButton } from "../tiptap-ui/list-button";
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button";
import { BlockquoteButton } from "../tiptap-ui/blockquote-button";

import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import CustomButton from "./CustomButton";
import { useEffect, useRef, useState } from "react";

export default function MyEditor() {
  // 텍스트 영역
  const [text, setText] = useState<string>("HelloWorld");
  const [files, setFiles] = useState<File[]>([]);

  // 파일 추가 시 확장되는 높이
  const [editorHeight, setEditorHeight] = useState<number>(10);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const finalHeight = isOpen ? editorHeight + 70 : editorHeight;
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      const editorElement = editorRef.current;
      const contentHeight = editorElement.scrollHeight;
      const baseHeight = Math.max(40, contentHeight);
      // const expandedHeight = isOpen ? 70 : 0;
      setEditorHeight(baseHeight);
    }
  }, [text, isOpen]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: text,
    onUpdate: ({ editor }) => {
      setText(editor.getText());
    },
  });

  return (
    <div className="rounded-t-lg rounded-b-lg border-input border">
      <EditorContext.Provider value={{ editor }}>
        <div className="p-2 bg-muted/50">
          <div className="tiptap-button-group" data-orientation="horizontal">
            <MarkButton type="bold" />
            <MarkButton type="italic" />
            <MarkButton type="strike" />

            <LinkPopover />
            <ListButton type="orderedList" />
            <ListButton type="bulletList" />

            <BlockquoteButton />
            <MarkButton type="code" />
            <CodeBlockButton />
          </div>
        </div>
        <div
          className={`transition-all duration-300 ease-in`}
          ref={editorRef}
          style={{ height: `${finalHeight}px` }}
        >
          <EditorContent
            editor={editor}
            role="presentation"
            className="bg-transparent rounded-b-md px-3 py-2 text-sm min-h-16 w-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none"
          />
        </div>
        <div>
          <CustomButton
            files={files}
            setFiles={setFiles}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </div>
      </EditorContext.Provider>
    </div>
  );
}
