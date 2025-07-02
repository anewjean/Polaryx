interface ChatEditButtonProps {
  visible: boolean;
  onClick: () => void;
  onDelete?: () => void;
}

export function ChatEditButton({ visible, onClick, onDelete }: ChatEditButtonProps) {
  if (!visible) return null;
  return (
    <>
      <button
        onClick={onClick}
        className="ml-2 text-xs text-blue-500 border px-1 py-0.5 rounded hover:text-white hover:bg-blue-500"
      >
        수정
      </button>
      {onDelete && (
        <button
          onClick={onDelete}
          className="ml-1 text-xs text-red-500 border px-1 py-0.5 rounded hover:text-white hover:bg-red-500"
        >
          삭제
        </button>
      )}
    </>
  );
}
