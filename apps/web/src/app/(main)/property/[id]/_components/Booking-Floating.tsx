import { formatCurrencyRp } from '@/lib/formatNumber';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BookingDateRangeSchema } from '@/schemas/transaction-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppDispatch } from '@/redux/hook';
import { checkBookingClientThunk } from '@/redux/slices/client/transaction-thunk';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';
import { countDaysInRange } from '@/lib/countDaysInRange';
import { useRouter } from 'next/navigation';
import BookingForm from './BookingForm';
import BookingDialog from './BookingDialog';

const BookingFloating = ({
  pId,
  totalPay,
  orderList,
}: {
  pId: string;
  totalPay: number;
  orderList: {
    id: string;
    type: string;
    price: number;
    quantity: number;
    amount: number;
  }[];
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [daysBooking, setDaysBooking] = useState(0);

  const { toast } = useToast();

  const router = useRouter();

  const dispatch = useAppDispatch();
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof BookingDateRangeSchema>>({
    resolver: zodResolver(BookingDateRangeSchema),
  });

  const onSubmit = (values: z.infer<typeof BookingDateRangeSchema>) => {
    const days = countDaysInRange(values.dateRange.from, values.dateRange.to);

    setDaysBooking(days);

    if (session && session.user.role === 'USER') {
      dispatch(
        checkBookingClientThunk({
          userId: session.user.id,
          pId,
          checkIn: new Date(form.getValues().dateRange.from),
          checkOut: new Date(form.getValues().dateRange.to),
          rooms: orderList.map(({ id: roomId, type, quantity }) => {
            return {
              roomId,
              quantity,
              type,
            };
          }),
          token: session.user.accessToken!,
        }),
      ).then((data: any) => {
        const result = data.payload.data;

        toast({
          variant: data.payload.error ? 'destructive' : 'default',
          title: data.payload.error
            ? JSON.stringify(data.payload.error)
            : 'Success Check Order',
        });

        if (!data.payload.error) {
          onHandleDialogOpen(true);
        }
      });
    } else {
      router.push('/signin');
    }
  };

  const onHandleDialogOpen = (open: boolean) => setIsDialogOpen(open);

  return (
    <div className="fixed bottom-0 left-1/2 z-50 flex w-screen -translate-x-1/2 flex-col justify-between gap-2 border-t-[1px] bg-white px-8 py-5 shadow-xl drop-shadow-xl sm:bottom-4 sm:w-fit sm:flex-row sm:gap-10 sm:rounded-full sm:px-3 sm:py-3">
      <div className="flex h-full flex-col gap-4 sm:flex-row sm:gap-8 sm:pl-8">
        <div className="flex h-full flex-col">
          <p className="text-athens-gray-500 text-sm font-semibold">Total</p>
          <p className="text-2xl font-bold">
            {formatCurrencyRp(totalPay * (daysBooking < 1 ? 1 : daysBooking))}
          </p>
        </div>
        <BookingForm
          form={form}
          onSubmit={onSubmit}
          daysBooking={daysBooking}
          setDaysBooking={setDaysBooking}
        />
      </div>

      <BookingDialog
        isDialogOpen={isDialogOpen}
        onHandleDialogOpen={onHandleDialogOpen}
        daysBooking={daysBooking}
        form={form}
        pId={pId}
        orderList={orderList}
      />
    </div>
  );
};

export default BookingFloating;
