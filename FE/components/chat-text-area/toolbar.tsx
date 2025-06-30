import { Editor } from "@tiptap/react";
import {
  HardDriveUploadIcon,
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  LinkIcon,
  ListOrderedIcon,
  ListIcon,
  TextQuoteIcon,
  CodeIcon,
} from "lucide-react";
import "./styles.scss";

import { CodeBlockIcon } from "../tiptap-icons/code-block-icon";

const ToolBar = ({ editor, setLink, addImage }: { editor: Editor; setLink: () => void; addImage: () => void }) => {
  return (
    <div className="toolbar">
      <div className="itemBox">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`toolbarBtn ${editor.isActive("bold") ? "is-active" : ""}`}
        >
          <BoldIcon className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`toolbarBtn ${editor.isActive("italic") ? "is-active" : ""}`}
        >
          <ItalicIcon className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`toolbarBtn ${editor.isActive("strike") ? "is-active" : ""}`}
        >
          <StrikethroughIcon className="w-4 h-4" />
        </button>

        <button onClick={setLink} className={`toolbarBtn ${editor.isActive("link") ? "is-active" : ""}`}>
          <LinkIcon className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`toolbarBtn ${editor.isActive("orderedList") ? "is-active" : ""}`}
        >
          <ListOrderedIcon className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`toolbarBtn ${editor.isActive("bulletList") ? "is-active" : ""}`}
        >
          <ListIcon className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`toolbarBtn ${editor.isActive("blockquote") ? "is-active" : ""}`}
        >
          <TextQuoteIcon className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`toolbarBtn ${editor.isActive("code") ? "is-active" : ""}`}
        >
          <CodeIcon className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`toolbarBtn ${editor.isActive("codeBlock") ? "is-active" : ""}`}
        >
          <CodeBlockIcon className="w-4 h-4" />
        </button>

        <button onClick={addImage} className={`toolbarBtn ${editor.isActive("image") ? "is-active" : ""}`}>
          <HardDriveUploadIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ToolBar;
