interface ChatProfileProps {
  imgSrc: string;
  nickname: string;
  time: string;
  content: string;
}

export function ChatProfile({ imgSrc, nickname, time, content }: ChatProfileProps) {
  return (
    <div className="flex items-start space-x-2 py-2">
      <img src={imgSrc} className="w-8 h-8 rounded-md" alt="profile" />
      <div>
        <div className="flex items-baseline space-x-2">
          <span className="font-bold">{nickname}</span>
          <span className="text-xs text-gray-400">{time}</span>
        </div>
        <div>{content}</div>
      </div>
    </div>
  );
}
