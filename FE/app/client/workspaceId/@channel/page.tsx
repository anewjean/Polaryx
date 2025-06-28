import TipTap from "@/components/chat-text-area/tiptap";

export default function ChannelDefault() {
  return (
    <div className="relative text-gray-800">
      <div className="fixed bottom-0 p-4 w-240">
        <TipTap />
      </div>
    </div>
  );
}
