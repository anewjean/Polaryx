"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode } from "react";
import { ModalOverlay, ModalContent } from "./Modal";

interface ModalTriggerProps {
  trigger: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function ModalTrigger({ trigger, children, defaultOpen = false }: ModalTriggerProps) {
  return (
    <Dialog.Root defaultOpen={defaultOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <ModalOverlay />
        <ModalContent>{children}</ModalContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
