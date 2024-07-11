'use client';

import React, { useState } from 'react';
import CalendarEvent from './_components/Calendar-Event';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { useSession } from 'next-auth/react';
import { getOrderByUserId } from '@/redux/slices/orderTenant-thunk';

const CalendarTenatPage = () => {
  const { data: session } = useSession();

  const dispatch = useAppDispatch();

  const { isLoading } = useAppSelector((state) => state.orderTenantReducer);

  useEffect(() => {
    if (session && isLoading) {
      dispatch(
        getOrderByUserId({
          token: session.user.accessToken!,
          userId: session.user.id,
        }),
      );
    }
  }, [isLoading]);

  return (
    <main className="min-h-svh pt-[78px]">
      <CalendarEvent />
    </main>
  );
};

export default CalendarTenatPage;
