import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

interface MiniProfileProps {
  imgSrc: string;
  nickname: string;
}

export function MiniProfile({ imgSrc, nickname }: MiniProfileProps) {
  return (
    <div>
      <HoverCardContent side="top" className="flex items-center HoverCardContent">
        <div>
          <img src={imgSrc} className="w-[60px] h-[60px] rounded-lg bg-gray-400 mr-3 object-cover" />
        </div>
        <div>
          <div className="ml-0.5 text-m-bold">{nickname}</div>
          <div className="mt-1.5">
            <Button className="cursor-pointer" variant="outline" size="sm">
              <div className="text-s-bold">DM</div>
            </Button>
            <Button className="ml-1 cursor-pointer" variant="outline" size="sm">
              <div className="text-s-bold">프로필</div>
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </div>
  );
}
