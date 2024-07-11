'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import {
  addTenantPropertyThunk,
  getTenantDetailPropertyThunk,
  getTenantPropertyCategoryThunk,
  updateTenantDetailPropertyThunk,
} from '@/redux/slices/tenant-thunk';
import { useSession } from 'next-auth/react';
import * as z from 'zod';
import {
  PropertySchema,
  UpdatePropertySchema,
} from '@/schemas/property-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import AddForm from './AddForm';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import UpdateForm from './UpdateForm';
import { useRouter } from 'next/navigation';

const UpdatePropertyForm = ({ id }: { id: string }) => {
  const { toast } = useToast();

  const route = useRouter();

  const { data: session } = useSession();

  const dispatch = useAppDispatch();

  const { isLoadingCategories, isLoadingProperty, property } = useAppSelector(
    (state) => state.tenantReducer,
  );

  const form = useForm<z.infer<typeof UpdatePropertySchema>>({
    // defaultValues: {
    //   // ...property,
    //   image: undefined, // or undefined depending on your use case
    // },
    resolver: zodResolver(UpdatePropertySchema),
  });

  const onSubmit = (data: z.infer<typeof UpdatePropertySchema>) => {
    dispatch(
      updateTenantDetailPropertyThunk({
        token: session?.user.accessToken!,
        id: session?.user.id!,
        pId: id,
        body: data,
      }),
    ).then((data: any) => {
      toast({
        variant: data.payload.error ? 'destructive' : 'default',
        title: data.payload.error ? data.payload.error : data.payload.success,
      });

      if (!data.payload.error) {
        form.reset();

        route.push('/tenant/property/');
      }
    });
  };

  useEffect(() => {
    if (isLoadingProperty === true)
      dispatch(
        getTenantDetailPropertyThunk({
          token: session?.user.accessToken!,
          id: session?.user.id!,
          pId: id,
        }),
      );

    if (isLoadingCategories === false) {
      form.reset({
        name: property?.name,
        description: property?.description,
        propertyCategoryId: property?.propertyCategoryId,
        location: property?.location,
      });
    }
  }, [isLoadingCategories, isLoadingProperty, property]);

  return (
    <>
      {property ? (
        <UpdateForm
          form={form}
          onSubmit={onSubmit}
          imageUrl={property?.image}
        />
      ) : (
        <div className="flex min-h-[calc(100svh-79px)] w-full items-center justify-center">
          <h2 className="text-xl font-semibold">Opps. Property not found.</h2>
        </div>
      )}
    </>
  );
};

export default UpdatePropertyForm;
