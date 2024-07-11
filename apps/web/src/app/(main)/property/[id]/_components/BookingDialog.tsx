import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { addBookingClientThunk } from '@/redux/slices/client/transaction-thunk';
import { formatCurrencyRp } from '@/lib/formatNumber';
import { UseFormReturn } from 'react-hook-form';
import { BookingDateRangeSchema } from '@/schemas/transaction-schema';
import * as z from 'zod';
import OrderItem from "./OrderItem";

interface BookingDialogProps {
  isDialogOpen: boolean;
  onHandleDialogOpen: (open: boolean) => void;
  daysBooking: number;
  form: UseFormReturn<z.infer<typeof BookingDateRangeSchema>>;
  pId: string;
  orderList: {
    id: string;
    type: string;
    price: number;
    quantity: number;
    amount: number;
  }[];
}

const BookingDialog = ({
  isDialogOpen,
  onHandleDialogOpen,
  daysBooking,
  form,
  pId,
  orderList,
}: BookingDialogProps) => {
  const { toast } = useToast();

  const router = useRouter();

  const dispatch = useAppDispatch();
  const { data: session } = useSession();

  const { isLoadingAddBooking, preOrderList } = useAppSelector(
    (state) => state.transactionClientReducer,
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={onHandleDialogOpen}>
      <DialogContent className="flex flex-col gap-6 sm:max-w-[600px]">
        {isLoadingAddBooking ? (
          <div className="flex h-52 items-center justify-center">
            <Loader2Icon size={24} className="animate-spin" />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Konfirmasi</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-1">
              {form.getValues().dateRange && (
                <>
                  <p className="flex gap-2">
                    <p className="text-athens-gray-950 w-20 font-semibold">
                      Check In
                    </p>
                    : {new Date(form.getValues().dateRange.from).toDateString()}{' '}
                  </p>
                  <p className="flex gap-2">
                    <p className="text-athens-gray-950 w-20 font-semibold">
                      Check Out
                    </p>
                    : {new Date(form.getValues().dateRange.to).toDateString()}
                  </p>
                </>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                {preOrderList &&
                  preOrderList.line_items.map(
                    (
                      {
                        id,
                        name,
                        specialPrice,
                        originalPrice,
                        quantity,
                        price,
                      },
                      index,
                    ) => (
                      <OrderItem
                        key={`${id}-${index}`}
                        name={name}
                        specialPrice={specialPrice}
                        originalPrice={originalPrice}
                        quantity={quantity}
                        price={price}
                        daysBooking={daysBooking}
                      />
                    ),
                  )}

                <Separator orientation="horizontal" />

                <div className="flex items-center justify-end gap-1">
                  <p className="text-lg font-bold">
                    {formatCurrencyRp(
                      preOrderList ? preOrderList.totalAmount : 0,
                    )}
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <DialogClose>
                <Button variant={'ghost'}>Batal</Button>
              </DialogClose>
              <Button
                onClick={() => {
                  session &&
                    dispatch(
                      addBookingClientThunk({
                        userId: session.user.id,
                        pId,
                        checkIn: new Date(form.getValues().dateRange.from),
                        checkOut: new Date(form.getValues().dateRange.to),
                        rooms: orderList.map(
                          ({ id: roomId, type, quantity }) => {
                            return {
                              roomId,
                              quantity,
                              type,
                            };
                          },
                        ),
                        token: session.user.accessToken!,
                      }),
                    ).then((data: any) => {
                      toast({
                        variant: data.payload.error ? 'destructive' : 'default',
                        title: data.payload.error
                          ? JSON.stringify(data.payload.error)
                          : 'Success Check Order',
                      });

                      if (!data.payload.error) {
                        router.push('/order');

                        onHandleDialogOpen(false);
                      }
                    });
                }}
              >
                Bayar
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
