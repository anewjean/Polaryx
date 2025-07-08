"use client";

import { Member } from "@/apis/tabApi";
import { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface MemberModalProps {
  trigger?: ReactNode;
  title?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  possibleMembers?: Member[];
}

export function MemberModal({ trigger, title, children, defaultOpen = false, open, onOpenChange }: MemberModalProps) {
  return (
    <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="flex flex-col h-[70vh] w-[30vw] justify-start overflow-y-auto scrollbar-thin p-0 gap-8">
        <DialogHeader className="pl-5 pt-5">
          <DialogTitle>{title || "Invite to Tab"}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
