'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { getBookingsClientThunk } from '@/redux/slices/client/transaction-thunk';
import { useSession } from 'next-auth/react';
import { OrderItem } from './_components/OrderItem';

const OrderPage = () => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  const { isLoadingGetBookings, orderList } = useAppSelector(
    (state) => state.transactionClientReducer,
  );

  useEffect(() => {
    if (session && isLoadingGetBookings) {
      dispatch(
        getBookingsClientThunk({
          userId: session.user.id,
          token: session.user.accessToken!,
        }),
      );
    }
  }, [session, isLoadingGetBookings, dispatch]);

  const sortedOrderList = orderList.slice().sort((a, b) => {
    const createAtA = new Date(a.updateAt).getTime();
    const createAtB = new Date(b.updateAt).getTime();
    return createAtB - createAtA;
  });

  return (
    <main className="min-h-svh w-full pt-[78px]">
      <div className="my-6 flex w-full flex-col items-center gap-3 px-6 md:px-10 xl:px-20">
        {orderList.length > 0 ? (
          sortedOrderList.map((order, index) => (
            <OrderItem key={`${order.id}-${index}`} order={order} />
          ))
        ) : (
          <div className="flex min-h-[calc(100svh-79px)] w-full items-center justify-center">
            <h2 className="text-xl font-semibold">Opps. Order not found.</h2>
          </div>
        )}
      </div>
    </main>
  );
};

export default OrderPage;
