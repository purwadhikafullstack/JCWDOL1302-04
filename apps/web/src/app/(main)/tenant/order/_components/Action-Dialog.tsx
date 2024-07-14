import React, { ReactNode } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const ActionDialog = ({
  onOpenChange,
  description,
  onConfirmClick,
  open,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  description: string;
  onConfirmClick: () => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={onConfirmClick}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActionDialog;
