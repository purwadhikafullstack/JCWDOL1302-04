import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { addTenantRoomThunk } from '@/redux/slices/room-thunk';
import { useSession } from 'next-auth/react';
import * as z from 'zod';
import { RoomSchema } from '@/schemas/room-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import AddForm from './AddForm';

const AddRoomForm = ({ pId }: { pId: string }) => {
  const { toast } = useToast();
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const [isOpenSheet, setIsOpenSheet] = useState(false);

  const form = useForm<z.infer<typeof RoomSchema>>({
    defaultValues: {
      type: '', // Initialize with empty string or appropriate default value
      description: '',
      price: '',
      image: undefined, // or undefined depending on your use case
    },
    resolver: zodResolver(RoomSchema),
  });

  const onSubmit = (data: z.infer<typeof RoomSchema>) => {
    dispatch(
      addTenantRoomThunk({
        token: session?.user.accessToken!,
        id: session?.user.id!,
        pId,
        body: data,
      }),
    ).then((data: any) => {
      toast({
        variant: data.payload.error ? 'destructive' : 'default',
        title: data.payload.error ? data.payload.error : data.payload.success,
      });

      if (!data.payload.error) {
        form.reset();
        onSheetOpenHandler(false);
      }
    });
  };

  const onSheetOpenHandler = (value: boolean) => {
    form.reset();
    setIsOpenSheet(value);
  };

  return (
    <Sheet open={isOpenSheet} onOpenChange={onSheetOpenHandler}>
      <SheetTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} /> <span>Add Room</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        className="flex h-[95%] flex-col gap-10 overflow-y-auto"
        side={'bottom'}
      >
        <SheetHeader>
          <SheetTitle>Add Room</SheetTitle>
          <SheetDescription>
            This action will add your room to the list
          </SheetDescription>
        </SheetHeader>
        <AddForm form={form} onSubmit={onSubmit} />
      </SheetContent>
    </Sheet>
  );
};

export default AddRoomForm;
