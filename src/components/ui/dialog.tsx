"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Icon } from "@/components/icon";
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
export function DialogContent({
  children,
  className = "",
  hideClose = false,
}: {
  children: React.ReactNode;
  className?: string;
  hideClose?: boolean;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="dialog-overlay" />
      <DialogPrimitive.Content className={`dialog-content ${className}`}>
        {children}
        {!hideClose && (
          <DialogPrimitive.Close className="dialog-x" aria-label="Đóng">
            <Icon name="close" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
