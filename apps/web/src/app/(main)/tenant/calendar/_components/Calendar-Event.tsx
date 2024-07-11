import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import enUS from 'date-fns/locale/en-US';
import { addDays } from 'date-fns';
import { EventSourceInput } from '@fullcalendar/core';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TGetOrdersByUserId } from '@/redux/slices/orderTenant-slice';
import { cn } from '@/lib/utils';

const CalendarEvent = () => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  const { orders } = useAppSelector((state) => state.orderTenantReducer);

  const [isEventOpen, setIsEventOpen] = useState<{
    isOpen: boolean;
    order?: TGetOrdersByUserId;
  }>({
    isOpen: false,
  });

  const [events, setEvents] = useState<EventSourceInput>([]);

  const onDialogOpenHandler = (open: boolean) =>
    setIsEventOpen({ isOpen: open });

  useEffect(() => {
    setEvents(
      orders
        .slice()
        .filter(({ status }) => status === 'finished')
        .map(({ orderId, name, checkIn, checkOut }) => {
          return {
            title: name,
            id: orderId,
            start: new Date(checkIn),
            end: new Date(checkOut),
            color: `#${(((1 << 24) * Math.random()) | 0).toString(16)}`,
          };
        }),
    );
  }, [orders]);

  return (
    <>
      <div className="w-full px-6 py-5 md:px-10 xl:px-20">
        {/* {JSON.stringify(orders)}
      {JSON.stringify(events)} */}
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          displayEventTime={false}
          eventClick={(info) => {
            setIsEventOpen({
              isOpen: true,
              order: orders.find(({ orderId }) => info.event.id === orderId),
            });
          }}
          height={"100svh"}
        
        />
      </div>
      <Dialog open={isEventOpen.isOpen} onOpenChange={onDialogOpenHandler}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEventOpen.order && isEventOpen.order.name}
            </DialogTitle>
            <DialogDescription>
              {isEventOpen.order && isEventOpen.order.orderId}
            </DialogDescription>
          </DialogHeader>
          {isEventOpen.order && (
            <div className="grid grid-cols-4 gap-y-1 gap-x-2">
              <p className="text-sm">Invoice Id</p>
              <p className="text-athens-gray-600 col-span-3 flex items-center text-sm font-semibold">
                {isEventOpen.order.invoiceId}
              </p>
              <p className="text-sm">Check In</p>
              <p className="text-athens-gray-600 col-span-3 flex items-center text-sm">
                {new Date(isEventOpen.order.checkIn).toDateString()}
              </p>
              <p className="text-sm">Check Out</p>
              <p className="text-athens-gray-600 col-span-3 flex items-center text-sm">
                {new Date(isEventOpen.order.checkOut).toDateString()}
              </p>
              <p className="text-sm">Status</p>
              <p
                className={cn(
                  'col-span-3 flex items-center text-sm font-semibold capitalize',
                  isEventOpen.order.status === 'finished'
                    ? 'text-gossamer-600'
                    : isEventOpen.order.status === 'cancelled'
                      ? 'text-red-700'
                      : isEventOpen.order.status === 'pending' &&
                          new Date(isEventOpen.order.expDateTime) < new Date()
                        ? 'text-yellow-700'
                        : 'text-yellow-500',
                )}
              >
                {isEventOpen.order.status}
              </p>
              <p className="text-sm">Customer</p>
              <p className="text-athens-gray-600 col-span-3 flex items-center text-sm">
                {isEventOpen.order.customerName}
              </p>
              <p className="text-sm">Rooms</p>
              <p className="text-athens-gray-600 col-span-3 flex items-center text-sm">
                {isEventOpen.order.rooms
                  .map(({ type, quantity }) => `Type ${type} (${quantity} Kamar)`)
                  .join(', ')}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CalendarEvent;
