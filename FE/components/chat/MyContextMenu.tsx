import { ContextMenuContent, ContextMenuItem } from "@/components/ui/context-menu";

interface MyContextMenuProps {
  id: number;
}

export function MyContextMenu({ id }: MyContextMenuProps) {
  // const router = useRouter();

  return (
    <ContextMenuContent>
      <ContextMenuItem>메시지 편집</ContextMenuItem>
      <ContextMenuItem>메시지 삭제</ContextMenuItem>
    </ContextMenuContent>
  );
}
