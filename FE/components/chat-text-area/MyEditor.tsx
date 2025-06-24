import { EditorContent, EditorContext, useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { MarkButton } from '@/components/tiptap-ui/mark-button'
import { Link } from '@tiptap/extension-link'
import { LinkPopover } from '../tiptap-ui/link-popover'
import { ListButton } from '../tiptap-ui/list-button'
import { CodeBlockButton } from '@/components/tiptap-ui/code-block-button'
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '@/components/tiptap-ui-primitive/toolbar'
import { BlockquoteButton } from '../tiptap-ui/blockquote-button'

import '@/components/tiptap-node/code-block-node/code-block-node.scss'
import '@/components/tiptap-node/paragraph-node/paragraph-node.scss'
import '@/components/tiptap-node/list-node/list-node.scss'


export default function MyEditor() {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link.configure({
      openOnClick: false,
    }),
    ],
    content: `
        <p>
            <strong>Bold</strong> for emphasis with <code>**</code> or <code>⌘+B</code> or the <code>B</code> button.
        </p>
        <p>
            <em>Italic</em> for subtle nuances with <code>*</code> or <code>⌘+I</code> or the <code>I</code> button.
        </p>
        <p>
            <s>Strikethrough</s> to show revisions with <code>~~</code> or the <code>~~S~~</code> button.
        </p>
        <p>
            <code>Code</code> for code snippets with <code>:</code> or <code>⌘+⇧+C</code> or the <code>C</code> button.
        </p>
        `,
  })

  return (
    <EditorContext.Provider value={{ editor }}>
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

      <EditorContent editor={editor} role="presentation" />
    </EditorContext.Provider>
  )
}
