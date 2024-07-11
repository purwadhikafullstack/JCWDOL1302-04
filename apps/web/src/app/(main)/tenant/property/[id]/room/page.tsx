'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { getTenantRoomsThunk } from '@/redux/slices/room-thunk';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import RoomTable from './_components/RoomTable';
import AddRoomForm from './_components/AddRoomForm';

const RoomPage = ({ params }: { params: { id: string } }) => {
  const { data: session } = useSession();

  const dispatch = useAppDispatch();

  const { rooms, isLoadingRooms } = useAppSelector(
    (state) => state.roomReducer,
  );

  useEffect(() => {
    if (isLoadingRooms === true)
      dispatch(
        getTenantRoomsThunk({
          token: session?.user.accessToken!,
          id: session?.user.id!,
          pId: params.id,
        }),
      );
  }, [isLoadingRooms, rooms]);

  return (
    <main className="flex min-h-svh flex-col gap-6 pt-[78px]">
      <div className="mt-5 flex w-full flex-row justify-between px-6 md:px-10 xl:px-20">
        <p className="text-xl font-semibold">Room</p>

        <AddRoomForm pId={params.id} />
      </div>
      <div className="w-full px-6 md:px-10 xl:px-20">
        <RoomTable pId={params.id} />
      </div>
    </main>
  );
};

export default RoomPage;
