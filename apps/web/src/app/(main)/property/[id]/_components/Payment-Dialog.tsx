import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const PaymentDialog = ({ paymentUrl }: { paymentUrl: string }) => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const haldleIsDialogOpen = (open: boolean) => {
    setIsOpenDialog(open);
  };

  useEffect(() => {}, []);

  return (
    <>
      <Dialog open={isOpenDialog} onOpenChange={haldleIsDialogOpen}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
        </DialogContent>
        <iframe className="h-[500px] w-full" src={paymentUrl}></iframe>
      </Dialog>
    </>
  );
};

export default PaymentDialog;
