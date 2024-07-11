'use client';

import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { FromRoomAvailabilityPriceSchema } from '@/schemas/form-room-availability-price-schema';
import DialogCustomAdmin from '@/components/Dialog-Custom-Admin';
import FormSetRoomAvailability from './_components/Form-Set-Room-Availability';
import RoomAvailableTable from './_components/RoomAvailabilityTable';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import {
  getPropretyRooms,
  getRoomAvailability,
} from '@/redux/slices/roomAvailability-thunk';
import { useSession } from 'next-auth/react';

const RoomAvailability = () => {
  const [openDialogSetAvailability, setOpenDialogSetAvailability] =
    useState<boolean>(false);
  const [modalPopover, setModalPopover] = useState<boolean>(false);
  const [roomAvailaId, setRoomAvailaId] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const { refetch } = useAppSelector((state) => state.roomAvailabilityReducer);

  const form = useForm<z.infer<typeof FromRoomAvailabilityPriceSchema>>({
    resolver: zodResolver(FromRoomAvailabilityPriceSchema),
  });

  const handleOpenDialogSetAvailability = (open: boolean) => {
    setOpenDialogSetAvailability(open);
    setModalPopover(false);
    form.reset();
    setRoomId('');
    setRoomAvailaId('');
  };

  useEffect(() => {
    if (session?.user) {
      dispatch(
        getPropretyRooms({
          token: session.user.accessToken!,
          userId: session.user.id,
        }),
      );
      dispatch(
        getRoomAvailability({
          token: session.user.accessToken!,
          userId: session.user.id,
        }),
      );
    }
  }, [dispatch, refetch]);

  return (
    <main className="min-h-svh px-6 pt-[78px] md:px-10 xl:px-20">
      <DialogCustomAdmin
        titleDialogContent={
          roomAvailaId ? 'Edit room availability' : 'Add room availability'
        }
        descripDialogContent={
          roomAvailaId
            ? ''
            : 'If the room field is empty, create your property and room first.'
        }
        onOpenChange={handleOpenDialogSetAvailability}
        open={openDialogSetAvailability}
      >
        <FormSetRoomAvailability
          form={form}
          handleOpenDialogSetAvailability={handleOpenDialogSetAvailability}
          modalPopover={modalPopover}
          roomAvailaId={roomAvailaId}
          roomId={roomId}
        />
      </DialogCustomAdmin>
      <div className="my-6 flex flex-col justify-between md:flex-row md:items-center">
        <h1 className="text-lg font-bold text-slate-900 md:text-2xl">
          Room Availability
        </h1>
        <Button
          onClick={() => {
            handleOpenDialogSetAvailability(true);
            setModalPopover(true);
          }}
        >
          Add Room Availability
        </Button>
      </div>
      <RoomAvailableTable
        form={form}
        setOpenDialogSetAvailability={setOpenDialogSetAvailability}
        roomAvailaId={roomAvailaId}
        setRoomAvailaId={setRoomAvailaId}
        setRoomId={setRoomId}
        setModalPopover={setModalPopover}
      />
    </main>
  );
};

export default RoomAvailability;
