import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  cancelBookingsClientThunk,
  updateBookingsClientThunk,
} from '@/redux/slices/client/transaction-thunk';
import { Session } from 'next-auth';

interface DialogProps {
  session?: Session | null;
  invoiceId: string;
  dispatch: any;
}

interface DialogLinkPaymentProps {
  isOpenDialog: boolean;
  handleIsDialogOpen: (open: boolean) => void;
  urlPayment: string;
}

const DialogCancelPayment = ({ session, invoiceId, dispatch }: DialogProps) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button className="w-full bg-red-600 text-white hover:bg-red-600/90">
        Cancel Payment
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader className="gap-4">
        <DialogTitle>Apakah Anda benar-benar yakin?</DialogTitle>
        <DialogDescription>
          Tindakan ini tidak bisa dibatalkan. Tindakan ini akan membatalkan
          order anda secara permanen.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose>
          <Button variant="ghost">Batal</Button>
        </DialogClose>
        <Button
          className="bg-gossamer-500 hover:bg-gossamer-500/90"
          onClick={() => {
            session &&
              dispatch(
                cancelBookingsClientThunk({
                  userId: session.user.id,
                  invoiceId,
                  token: session.user.accessToken!,
                }),
              );
          }}
        >
          Yakin
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const DialogCheckPaymentStatus = ({
  session,
  invoiceId,
  dispatch,
}: DialogProps) => (
  <Button
    className="bg-gossamer-600 hover:bg-gossamer-600/90 w-full text-white"
    onClick={() => {
      session &&
        dispatch(
          updateBookingsClientThunk({
            userId: session.user.id,
            invoiceId,
            token: session.user.accessToken!,
          }),
        );
    }}
  >
    Check Payment Status
  </Button>
);

const DialogLinkPayment = ({
  isOpenDialog,
  handleIsDialogOpen,
  urlPayment,
}: DialogLinkPaymentProps) => (
  <Dialog open={isOpenDialog} onOpenChange={handleIsDialogOpen}>
    <DialogTrigger asChild>
      <Button className="bg-gossamer-600 hover:bg-gossamer-600/90 w-full text-white">
        Link Payment
      </Button>
    </DialogTrigger>
    <DialogContent onInteractOutside={(e) => e.preventDefault()}>
      <DialogHeader>
        <DialogTitle></DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <iframe className="h-[500px] w-full" src={urlPayment}></iframe>
    </DialogContent>
  </Dialog>
);

export { DialogCancelPayment, DialogCheckPaymentStatus, DialogLinkPayment };
