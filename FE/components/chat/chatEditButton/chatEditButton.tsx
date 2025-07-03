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
      <PopoverContent className="w-80 bg-white">
        <div className="grid gap-4">
          <div className="space-y-2 ms-8">
            <EditButton text="메시지 편집" subtext="Edit" />
            <EditButton text="메시지 삭제" subtext="Delete" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
