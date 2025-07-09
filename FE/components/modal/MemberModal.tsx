"use client";

import { Member } from "@/apis/tabApi";
import { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Users } from "lucide-react";

interface MemberModalProps {
  trigger?: ReactNode;
  title?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  possibleMembers?: Member[];
  membersCount?: number;
}

export function MemberModal({ trigger, title, children, defaultOpen = false, open, onOpenChange, membersCount }: MemberModalProps) {
  return (
    <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="flex flex-col h-[70vh] w-[30vw] scrollbar-thin p-0 gap-0">
        <DialogHeader className="flex flex-row items-end p-5 pr-15 gap-3">          
          <DialogTitle className="text-xl font-semibold truncate">{title || "Invite to Tab"}</DialogTitle>          
          <div className="flex flex-row items-center gap-1 pb-1">
            <Users className="w-[13px] h-[13px] text-gray-600" />
            <span className="text-normal text-gray-600 text-xs">{membersCount}</span>
          </div>
        </DialogHeader>
        <Separator className="bg-gray-300" />
        {children}
      </DialogContent>
    </Dialog>
  );
}
