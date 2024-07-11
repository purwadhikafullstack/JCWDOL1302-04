'use client';

import React, { useEffect } from 'react';
import AddPropertyForm from './_components/AddPropertyForm';
import PropertyTable from './_components/PropertyTable';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import {
  getTenantPropertiesThunk,
  getTenantPropertyCategoryThunk,
} from '@/redux/slices/tenant-thunk';
import { useSession } from 'next-auth/react';

const Property = () => {
  const { data: session } = useSession();

  const dispatch = useAppDispatch();

  const { categories, isLoadingCategories, isLoadingProperties } =
    useAppSelector((state) => state.tenantReducer);

  useEffect(() => {
    if (isLoadingCategories === true)
      dispatch(
        getTenantPropertyCategoryThunk({ token: session?.user.accessToken! }),
      );

    if (isLoadingProperties === true)
      dispatch(
        getTenantPropertiesThunk({
          token: session?.user.accessToken!,
          id: session?.user.id!,
        }),
      );
  }, [isLoadingProperties, isLoadingCategories]);

  return (
    <main className="flex min-h-svh flex-col gap-6 pt-[78px]">
      <div className="mt-5 flex w-full flex-row justify-between px-6 md:px-10 xl:px-20">
        <p className="text-xl font-semibold">Property</p>

        <AddPropertyForm />
      </div>
      <div className="w-full px-6 md:px-10 xl:px-20">
        <PropertyTable />
      </div>
    </main>
  );
};

export default Property;
