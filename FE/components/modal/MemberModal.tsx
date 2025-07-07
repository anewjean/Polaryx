"use client";

import { ReactNode } from "react";
import { ModalTrigger } from "./ModalTrigger";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";


interface MemberModalProps {
  trigger: ReactNode;
  title?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MemberModal({ trigger, title, children, defaultOpen = false, open, onOpenChange }: MemberModalProps) {
  return (
    <ModalTrigger trigger={trigger} defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex flex-col h-full justify-start overflow-y-auto scrollbar-thin p-0 gap-8">
          <DialogHeader className="pl-5 pt-5">
            <DialogTitle>{title}</DialogTitle>            
          </DialogHeader>          
          {children}
        </DialogContent>
      </Dialog>
    </ModalTrigger>
  );
}
