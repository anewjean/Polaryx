import './styles.scss'

import Document from '@tiptap/extension-document'
import FileHandler from '@tiptap/extension-file-handler'
import Heading from '@tiptap/extension-heading'
import Image from '@tiptap/extension-image'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { EditorContent, useEditor } from '@tiptap/react'
import React from 'react'

export default () => {
  const editor = useEditor({
    extensions: [
      Document,
      Heading,
      Paragraph,
      Text,
      Image,
      FileHandler.configure({
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
        onDrop: (currentEditor, files, pos) => {
            // 폴더인지 확인하고 처리
            const folderNames = new Set()
            
            files.forEach(file => {
              // webkitRelativePath가 있으면 폴더에서 온 파일
              if (file.webkitRelativePath) {
                const folderName = file.webkitRelativePath.split('/')[0]
                folderNames.add(folderName)
              } else {
                // 일반 이미지 파일 처리
                const fileReader = new FileReader()
                fileReader.readAsDataURL(file)
                fileReader.onload = () => {
                  currentEditor.chain().insertContentAt(pos, {
                    type: 'image',
                    attrs: {
                      src: fileReader.result,
                    },
                  }).focus().run()
                }
              }
            })
  
            // 폴더 이름들을 에디터에 삽입
            if (folderNames.size > 0) {
              const folderText = Array.from(folderNames).join(', ')
              currentEditor.chain().insertContentAt(pos, {
                type: 'paragraph',
                content: [{
                  type: 'text',
                  text: `📁 ${folderText} 폴더가 선택되었습니다.`
                }]
              }).focus().run()
            }
          },
        onPaste: (currentEditor, files, htmlContent) => {
          files.forEach(file => {
            if (htmlContent) {
              // if there is htmlContent, stop manual insertion & let other extensions handle insertion via inputRule
              // you could extract the pasted file from this url string and upload it to a server for example
              console.log(htmlContent) // eslint-disable-line no-console
              return false
            }

            const fileReader = new FileReader()

            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
              currentEditor.chain().insertContentAt(currentEditor.state.selection.anchor, {
                type: 'image',
                attrs: {
                  src: fileReader.result,
                },
              }).focus().run()
            }
          })
        },
      }),
    ],
    content: `
      <h1>
        Try to paste or drop files into this editor
      </h1>
      <p></p>
    `,
  })

  return (
    <EditorContent editor={editor} />
  )
}