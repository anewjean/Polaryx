"use client";

import { ReactNode } from "react";
import { ModalTrigger } from "./ModalTrigger";
import { ModalClose } from "./Modal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DialogModalProps {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DialogModal({ trigger, title, children, defaultOpen = false, open, onOpenChange }: DialogModalProps) {
  return (
    <ModalTrigger trigger={trigger} defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex flex-col justify-start py-5 gap-8">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    </ModalTrigger>
  );
}
