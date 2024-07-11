import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
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
import {
  addTenantPropertyThunk,
  getTenantPropertyCategoryThunk,
} from '@/redux/slices/tenant-thunk';
import { useSession } from 'next-auth/react';
import * as z from 'zod';
import { PropertySchema } from '@/schemas/property-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import AddForm from './AddForm';

const AddPropertyForm = () => {
  const { toast } = useToast();

  const { data: session } = useSession();

  const dispatch = useAppDispatch();

  const { categories, isLoadingCategories } = useAppSelector(
    (state) => state.tenantReducer,
  );

  const [isOpenSheet, setIsOpenSheet] = useState(false);

  const form = useForm<z.infer<typeof PropertySchema>>({
    defaultValues: {
      name: '', // Initialize with empty string or appropriate default value
      description: '',
      location: '',
      propertyCategoryId: undefined, // or appropriate initial value
      image: undefined, // or undefined depending on your use case
    },
    resolver: zodResolver(PropertySchema),
  });

  const onSubmit = (data: z.infer<typeof PropertySchema>) => {
    dispatch(
      addTenantPropertyThunk({
        token: session?.user.accessToken!,
        email: session?.user.email!,
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

  const onSheetOpenHandler = (value: boolean) => setIsOpenSheet(value);

  useEffect(() => {
    if (isLoadingCategories === true)
      dispatch(
        getTenantPropertyCategoryThunk({ token: session?.user.accessToken! }),
      );
  }, [isLoadingCategories]);

  return (
    <Sheet open={isOpenSheet} onOpenChange={onSheetOpenHandler}>
      <SheetTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} /> <span>Add Property</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        className="flex h-[95%] flex-col gap-10 overflow-y-auto"
        side={'bottom'}
      >
        <SheetHeader>
          <SheetTitle>Add Property</SheetTitle>
          <SheetDescription>
            This action will add your property to list
          </SheetDescription>
        </SheetHeader>
        <AddForm form={form} onSubmit={onSubmit} />
      </SheetContent>
    </Sheet>
  );
};

export default AddPropertyForm;
