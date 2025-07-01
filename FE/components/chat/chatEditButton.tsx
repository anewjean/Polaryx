interface ChatEditButtonProps {
  onClick: () => void;
  visible: boolean;
}

export function ChatEditButton({ visible, onClick }: ChatEditButtonProps) {
  if (!visible) return null;
  return (
    <button onClick={onClick} className="ml-2 text-xs text-gray-500 border px-1 py-0.5 rounded hover:text-blue-500">
      수정
    </button>
  );
}
