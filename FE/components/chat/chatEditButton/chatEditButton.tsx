import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import { EditButton } from "./Button";

export function ChatEditButton() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <EllipsisVertical />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-[200px] bg-white overflow-hidden">
        <div className="flex w-[200px] flex-col">
          <EditButton text="메시지 편집" subtext="Edit" />
          <hr />
          <EditButton text="메시지 삭제" subtext="Delete" />
        </div>
      </PopoverContent>
    </Popover>
  );
}
