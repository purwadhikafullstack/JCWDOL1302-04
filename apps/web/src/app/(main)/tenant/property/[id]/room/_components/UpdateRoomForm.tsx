'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import {
  getTenantDetailRoomThunk,
  updateTenantDetailRoomThunk,
} from '@/redux/slices/room-thunk';
import { useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import UpdateForm from './UpdateForm';
import { useRouter } from 'next/navigation';
import { UpdateRoomSchema } from '@/schemas/room-schema';
import * as z from 'zod';

const UpdateRoomForm = ({ pId, rId }: { rId: string; pId: string }) => {
  const { toast } = useToast();
  const route = useRouter();
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const { isLoadingRoom, room } = useAppSelector((state) => state.roomReducer);

  const form = useForm<z.infer<typeof UpdateRoomSchema>>({
    resolver: zodResolver(UpdateRoomSchema),
  });

  const onSubmit = (data: z.infer<typeof UpdateRoomSchema>) => {
    dispatch(
      updateTenantDetailRoomThunk({
        token: session?.user.accessToken!,
        id: session?.user.id!,
        pId,
        rId,
        body: data,
      }),
    ).then((data: any) => {
      toast({
        variant: data.payload.error ? 'destructive' : 'default',
        title: data.payload.error ? data.payload.error : data.payload.success,
      });

      if (!data.payload.error) {
        form.reset();
        route.push(`/tenant/property/${pId}/room`);
      }
    });
  };

  useEffect(() => {
    dispatch(
      getTenantDetailRoomThunk({
        token: session?.user.accessToken!,
        id: session?.user.id!,
        pId,
        rId,
      }),
    );
  }, []);

  useEffect(() => {
    if (room) {
      form.reset({
        type: room?.type,
        description: room?.description,
        price: String(room?.price),
      });
    }
  }, [room]);

  return (
    <>
      {room ? (
        <UpdateForm form={form} onSubmit={onSubmit} imageUrl={room.image} />
      ) : (
        <div className="flex min-h-[calc(100svh-79px)] w-full items-center justify-center">
          <h2 className="text-xl font-semibold">Opps. Property not found.</h2>
        </div>
      )}
    </>
  );
};

export default UpdateRoomForm;
