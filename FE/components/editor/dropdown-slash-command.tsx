"use client";

import {
  CheckSquare,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  List,
  ListOrdered,
  Text,
  TextQuote,
  Search,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Editor, Range } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import { uploadFn } from "./image-upload";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// 기존 slash-command의 아이템들과 동일한 아이템 정의
export const dropdownItems = [
  {
    title: "텍스트",
    description: "일반 텍스트로 시작하세요.",
    searchTerms: ["p", "paragraph", "텍스트", "문단"],
    icon: <Text size={18} />,
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").run();
    },
  },
  {
    title: "할 일 목록",
    description: "할 일을 체크리스트로 관리하세요.",
    searchTerms: ["todo", "task", "list", "check", "checkbox", "할일", "체크"],
    icon: <CheckSquare size={18} />,
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    title: "제목 1",
    description: "큰 섹션 제목",
    searchTerms: ["title", "big", "large", "h1", "제목", "큰제목"],
    icon: <Heading1 size={18} />,
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run();
    },
  },
  {
    title: "제목 2",
    description: "중간 크기 제목",
    searchTerms: ["subtitle", "medium", "h2", "중간제목"],
    icon: <Heading2 size={18} />,
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run();
    },
  },
  {
    title: "제목 3",
    description: "작은 제목",
    searchTerms: ["subtitle", "small", "h3", "작은제목"],
    icon: <Heading3 size={18} />,
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run();
    },
  },
  {
    title: "글머리 기호 목록",
    description: "글머리 기호 목록을 만듭니다.",
    searchTerms: ["unordered", "point", "bullet", "글머리", "기호"],
    icon: <List size={18} />,
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "번호 목록",
    description: "번호가 매겨진 목록을 만듭니다.",
    searchTerms: ["ordered", "number", "번호"],
    icon: <ListOrdered size={18} />,
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: "인용구",
    description: "인용문을 작성합니다.",
    searchTerms: ["blockquote", "quote", "인용"],
    icon: <TextQuote size={18} />,
    command: ({ editor, range }: { editor: Editor; range: Range }) =>
      editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").toggleBlockquote().run(),
  },
  {
    title: "코드",
    description: "코드 스니펫을 작성합니다.",
    searchTerms: ["codeblock", "code", "코드"],
    icon: <Code size={18} />,
    command: ({ editor, range }: { editor: Editor; range: Range }) => 
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: "이미지",
    description: "컴퓨터에서 이미지를 업로드합니다.",
    searchTerms: ["photo", "picture", "media", "이미지", "사진"],
    icon: <ImageIcon size={18} />,
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().focus().deleteRange(range).run();
      // 이미지 업로드
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async () => {
        if (input.files?.length) {
          const file = input.files[0];
          const pos = editor.view.state.selection.from;
          uploadFn(file, editor.view, pos);
        }
      };
      input.click();
    },
  }
];

interface DropdownSlashCommandProps {
  editor: Editor;
  range: Range;
}

// 드롭다운 메뉴를 사용한 슬래시 커맨드 컴포넌트
export const DropdownSlashCommand = ({ editor, range }: DropdownSlashCommandProps) => {
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // 검색어에 따라 아이템 필터링
  const filteredItems = dropdownItems.filter((item) => {
    if (!search) return true;
    
    const searchLower = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.searchTerms.some(term => term.toLowerCase().includes(searchLower))
    );
  });

  // 선택된 아이템 실행
  const executeCommand = useCallback((item: typeof dropdownItems[0]) => {
    item.command({ editor, range });
    setOpen(false);
  }, [editor, range]);

  // 키보드 이벤트 처리
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => 
        prev < filteredItems.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        executeCommand(filteredItems[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  }, [filteredItems, selectedIndex, executeCommand]);

  // 컴포넌트가 마운트될 때 포커스
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 드롭다운이 닫힐 때 에디터에서 슬래시 삭제
  useEffect(() => {
    if (!open) {
      editor.chain().focus().deleteRange(range).run();
    }
  }, [open, editor, range]);

  // 선택된 아이템이 변경될 때 스크롤 조정
  useEffect(() => {
    const selectedElement = document.getElementById(`dropdown-item-${selectedIndex}`);
    if (selectedElement && menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const selectedRect = selectedElement.getBoundingClientRect();
      
      if (selectedRect.bottom > menuRect.bottom) {
        menuRef.current.scrollTop += selectedRect.bottom - menuRect.bottom;
      } else if (selectedRect.top < menuRect.top) {
        menuRef.current.scrollTop -= menuRect.top - selectedRect.top;
      }
    }
  }, [selectedIndex]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div className="hidden" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-72 p-2"
        align="start"
        forceMount
      >
        <div className="flex items-center px-2 mb-2 border rounded-md">
          <Search className="w-4 h-4 mr-2 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder="명령어 검색..."
            className="h-9 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
        </div>
        
        <div 
          ref={menuRef}
          className="max-h-80 overflow-y-auto"
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <DropdownMenuItem
                key={item.title}
                id={`dropdown-item-${index}`}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 cursor-pointer",
                  selectedIndex === index && "bg-accent text-accent-foreground"
                )}
                onSelect={() => executeCommand(item)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted">
                  {item.icon}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{item.title}</span>
                  <span className="text-xs text-muted-foreground">{item.description}</span>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              검색 결과가 없습니다
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// TipTap 확장 기능으로 사용하기 위한 함수
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';

// PluginKey 생성
const dropdownSlashCommandPluginKey = new PluginKey('dropdownSlashCommand');

export function createDropdownSlashCommandExtension() {
  return Extension.create({
    name: 'dropdownSlashCommand',
    
    addProseMirrorPlugins() {
      const editor = this.editor;
      
      return [
        new Plugin({
          key: dropdownSlashCommandPluginKey,
          props: {
            handleKeyDown(view: any, event: KeyboardEvent) {
              // '/' 키를 감지하여 드롭다운 메뉴 표시
              if (event.key === '/' && !view.state.selection.empty) {
                return false;
              }
              
              if (event.key === '/' && view.state.selection.empty) {
                const { state } = view;
                const { selection } = state;
                const { $from } = selection;
                
                // 현재 위치가 라인의 시작인지 확인
                const isStartOfLine = $from.parentOffset === 0;
                
                if (isStartOfLine) {
                  // 슬래시 문자를 삽입
                  const tr = state.tr.insertText('/');
                  view.dispatch(tr);
                  
                  // 슬래시 문자를 포함하는 범위 생성
                  const range = {
                    from: $from.pos,
                    to: $from.pos + 1,
                  };
                  
                  // 드롭다운 메뉴 표시
                  const component = new ReactRenderer(DropdownSlashCommand, {
                    props: {
                      editor,
                      range,
                    },
                    editor,
                  });
                  
                  // tippy 팝업 생성
                  const tippyInstance = tippy('body', {
                    getReferenceClientRect: () => {
                      const { from } = range;
                      const domPos = view.coordsAtPos(from);
                      return domPos;
                    },
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start',
                    arrow: false,
                  })[0];
                  
                  // 컴포넌트가 언마운트될 때 tippy 인스턴스 제거
                  component.destroy = () => {
                    tippyInstance.destroy();
                  };
                  
                  return true;
                }
              }
              
              return false;
            },
          },
        }),
      ];
    },
  });
}
