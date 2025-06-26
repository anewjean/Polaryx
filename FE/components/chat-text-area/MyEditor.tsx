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

export default function MyEditor({
  content,
  isEditable,
}: {
  content: string;
  isEditable: boolean;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: content,
    editable: isEditable,
  });

  return (
    <div className="rounded-t-md border-input border">
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

        <EditorContent
          editor={editor}
          role="presentation"
          className="bg-transparent rounded-b-md px-3 py-2 text-sm min-h-16 w-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none"
        />
        <div>
          <CustomButton />
        </div>
      </EditorContext.Provider>
    </div>
  );
}
