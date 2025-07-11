// FE/components/editor/SideMenu.tsx
'use client';

import React, { FC } from 'react';
import type { Editor } from '@tiptap/react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Bold, Italic, List, Code, Zap } from 'lucide-react';
import { RotateCcw, RotateCw } from 'lucide-react';

interface SideMenuProps {
  editor: Editor | null;
  className?: string;
}



const menuItems = [
  { name: 'Bold',        command: 'bold',       icon: <Bold size={18} /> },
  { name: 'Italic',      command: 'italic',     icon: <Italic size={18} /> },
  { name: 'Bullet List', command: 'bulletList', icon: <List size={18} /> },
  { name: 'Code Block',  command: 'codeBlock',  icon: <Code size={18} /> },
];

const SideMenu: FC<SideMenuProps> = ({ editor, className = '' }) => {
  if (!editor) return null;

  return (
    <motion.aside
      className={`flex-shrink-0 w-56 bg-white border-r ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <nav className="flex flex-col p-4 space-y-2">
        <h2 className="mb-2 text-sm font-semibold uppercase text-gray-600">
          편집 도구
        </h2>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <RotateCcw size={18} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <RotateCw size={18} />
        </Button>

        {menuItems.map(({ name, command, icon }) => (
          <Button
            key={command}
            variant={editor.isActive(command) ? 'secondary' : 'ghost'}
            size="icon"
            className="justify-start space-x-2"
            onClick={() => {
              if (command === 'codeBlock') {
                editor.chain().focus().toggleCodeBlock().run();
              } else {
                editor.chain().focus().toggleMark(command).run();
              }
            }}
          >
            {icon}
            <span className="text-sm">{name}</span>
          </Button>
        ))}

        <Separator className="my-3" />

        <Button
          variant="outline"
          size="sm"
          className="mt-2 justify-start"
          onClick={() => editor.chain().focus().clearNodes().run()}
        >
          <Zap size={16} className="mr-1" />
          초기화
        </Button>
      </nav>
    </motion.aside>
  );
};

export default SideMenu;
