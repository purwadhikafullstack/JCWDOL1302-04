import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAppDispatch } from '@/redux/hook';
import { useSession } from 'next-auth/react';
import { formatCurrencyRp } from '@/lib/formatNumber';
import { countDaysInRange } from '@/lib/countDaysInRange';
import { formatDistance } from 'date-fns';
import Link from 'next/link';
import CountDown from './Count-Down';
import {
  DialogCancelPayment,
  DialogCheckPaymentStatus,
  DialogLinkPayment,
} from './Dialogs';
import { TOrderData } from '@/redux/slices/client/transaction-slice';

interface OrderItemProps {
  order: TOrderData;
}

const OrderItem = ({ order }: OrderItemProps) => {
  const {
    id,
    orderProperty,
    status,
    expDateTime,
    totalPayment,
    checkIn,
    checkOut,
    orderRooms,
    urlPayment,
    invoiceId,
    updateAt,
  } = order;

  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const handleIsDialogOpen = (open: boolean) => {
    setIsOpenDialog(open);
  };

  return (
    <div className="flex w-fit min-w-full flex-col gap-2 rounded-lg border-[1px] px-4 py-2 sm:min-w-[550px]">
      <div className="flex w-full items-center justify-between">
        <p>{orderProperty.name}</p>
        <p className="text-xs tracking-tighter">
          ({countDaysInRange(new Date(checkIn), new Date(checkOut))} days){' '}
          {new Date(checkIn).toDateString()} -{' '}
          {new Date(checkOut).toDateString()}
        </p>
      </div>
      <p className="text-athens-gray-500 flex gap-2 text-sm font-semibold">
        {orderRooms.map(({ id: idA, quantity, type }, indexA) => (
          <span key={`${idA}-${indexA}`}>
            {quantity} kamar {type},
          </span>
        ))}
      </p>
      <p className="text-sm font-semibold">{formatCurrencyRp(totalPayment)}</p>
      <p className="text-xs tracking-tighter">
        order at:{' '}
        {formatDistance(new Date(updateAt), new Date(), {
          addSuffix: true,
        })}
      </p>

      <div className="flex w-full justify-end">
        <div
          className={cn(
            'flex w-full items-center justify-center rounded-xl border-[1px] px-4 py-2',
            (status === 'pending' && new Date(expDateTime) < new Date()) ||
              status === 'cancelled' ||
              status === 'expired' ||
              status === 'rejected'
              ? 'border-red-700 text-red-700'
              : 'border-gossamer-600 text-gossamer-600',
            'text-sm font-bold',
          )}
        >
          {status === 'pending' && new Date(expDateTime) < new Date() ? (
            'Expired'
          ) : status === 'expired' ? (
            'Expired'
          ) : status === 'finished' ? (
            'Finished'
          ) : status === 'cancelled' ? (
            'Cancelled'
          ) : status === 'confirming' ? (
            'Confirming'
          ) : status === 'rejected' ? (
            'Rejected'
          ) : (
            <div className="flex flex-col items-center gap-3">
              <p>Waiting for Payment</p>
              <CountDown dateAt={new Date(expDateTime)} />
            </div>
          )}
        </div>
      </div>

      {status === 'pending' && new Date(expDateTime) > new Date() && (
        <>
          <div className="flex w-full justify-end">
            <DialogCancelPayment
              session={session}
              invoiceId={invoiceId}
              dispatch={dispatch}
            />
          </div>
          <div className="flex w-full justify-end">
            <DialogCheckPaymentStatus
              session={session}
              invoiceId={invoiceId}
              dispatch={dispatch}
            />
          </div>
          <div className="flex w-full justify-end">
            <DialogLinkPayment
              isOpenDialog={isOpenDialog}
              handleIsDialogOpen={handleIsDialogOpen}
              urlPayment={urlPayment}
            />
          </div>
        </>
      )}
      <Link className="w-full" href={`/order/${id}`}>
        <button className="text-gossamer-600 hover:bg-gossamer-100 w-full rounded-xl border-[1px] px-4 py-2 text-sm font-bold">
          Detail Order
        </button>
      </Link>
    </div>
  );
};

export { OrderItem };
