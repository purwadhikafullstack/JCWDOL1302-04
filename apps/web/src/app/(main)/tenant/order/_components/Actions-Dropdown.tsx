import { TGetOrdersByUserId } from '@/redux/slices/orderTenant-slice';
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Ban, Check, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/redux/hook';
import { useSession } from 'next-auth/react';
import {
  acceptOrderByTenantThunk,
  cancelOrderByTenantThunk,
} from '@/redux/slices/orderTenant-thunk';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ActionDialog from './Action-Dialog';

const ActionsDropdown = ({
  roomAvaila,
}: {
  roomAvaila: TGetOrdersByUserId;
}) => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const [isOpenDialogCancel, setIsOpenDialogCancel] = useState(false);
  const [isOpenDialogAccept, setIsOpenDialogAccept] = useState(false);
  const [isOpenDialogReject, setIsOpenDialogReject] = useState(false);

  const onDialogOpenCancel = (open: boolean) => setIsOpenDialogCancel(open);
  const onDialogOpenAccept = (open: boolean) => setIsOpenDialogAccept(open);
  const onDialogOpenReject = (open: boolean) => setIsOpenDialogReject(open);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {roomAvaila.status === 'pending' &&
            new Date(roomAvaila.expDateTime) > new Date() && (
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => onDialogOpenCancel(true)}
              >
                <Ban size={16} />
                <span>Cancel</span>
              </DropdownMenuItem>
            )}
          {roomAvaila.status === 'confirming' && (
            <>
              <DropdownMenuItem
                className="text-gossamer-700 flex items-center gap-2"
                onClick={() => onDialogOpenAccept(true)}
              >
                <Check size={16} />
                <span>Accept</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 text-red-700"
                onClick={() => onDialogOpenReject(true)}
              >
                <Ban size={16} />
                <span>Reject</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ActionDialog
        open={isOpenDialogCancel}
        onOpenChange={onDialogOpenCancel}
        description="This action cannot be undone. Are you sure you want to permanently Cancel this order from our servers?"
        onConfirmClick={() => {
          if (session)
            dispatch(
              cancelOrderByTenantThunk({
                tenantId: session.user.id,
                userId: roomAvaila.customerId,
                invoiceId: roomAvaila.invoiceId,
                token: session.user.accessToken!,
              }),
            ).then((data: any) => {
              toast({
                variant: data.payload.error ? 'destructive' : 'default',
                title: data.payload.error
                  ? data.payload.error
                  : data.payload.success,
              });
            });
        }}
      />
      <ActionDialog
        open={isOpenDialogAccept}
        onOpenChange={onDialogOpenAccept}
        description="This action cannot be undone. Are you sure you want to permanently Accept this order from our servers?"
        onConfirmClick={() => {
          if (session)
            dispatch(
              acceptOrderByTenantThunk({
                tenantId: session.user.id,
                userId: roomAvaila.customerId,
                invoiceId: roomAvaila.invoiceId,
                token: session.user.accessToken!,
              }),
            ).then((data: any) => {
              toast({
                variant: data.payload.error ? 'destructive' : 'default',
                title: data.payload.error
                  ? data.payload.error
                  : data.payload.success,
              });
            });
        }}
      />
      <ActionDialog
        open={isOpenDialogReject}
        onOpenChange={onDialogOpenReject}
        description="This action cannot be undone. Are you sure you want to permanently Reject this order from our servers?"
        onConfirmClick={() => {
          if (session)
            dispatch(
              cancelOrderByTenantThunk({
                tenantId: session.user.id,
                userId: roomAvaila.customerId,
                invoiceId: roomAvaila.invoiceId,
                token: session.user.accessToken!,
              }),
            ).then((data: any) => {
              toast({
                variant: data.payload.error ? 'destructive' : 'default',
                title: data.payload.error
                  ? data.payload.error
                  : data.payload.success,
              });
            });
        }}
      />
    </>
  );
};

export default ActionsDropdown;
