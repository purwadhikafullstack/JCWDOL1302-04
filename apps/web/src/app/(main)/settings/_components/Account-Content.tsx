import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AccountSchema } from '@/schemas/account-schema';
import { UseFormReturn, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import AccountBirthdateFormField from './Account-Birthdate-Form-Field';
import AccountGenderFormField from './Account-Gender-Form-Field';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { updateAccountThunk } from '@/redux/slices/settings-thunk';
import { Session } from 'next-auth';
import { useSession } from "next-auth/react";

const AccountContent = () => {
  const { data: session, update } = useSession()

  const { toast } = useToast();

  const defaultValues = useAppSelector(
    (state) => state.settingsReaducer.account,
  );

  const isPending = useAppSelector(
    (state) => state.settingsReaducer.isAccountLoading,
  );

  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof AccountSchema>>({
    resolver: zodResolver(AccountSchema),
  });

  const onSubmit = (values: z.infer<typeof AccountSchema>) => {
    dispatch(
      updateAccountThunk({ id: session ? session.user.id : '', values }),
    ).then((data: any) => {
      toast({
        variant: data.payload.error ? 'destructive' : 'default',
        title: data.payload.error ? data.payload.error : data.payload.success,
      });
    });
  };

  useEffect(() => {
    form.reset({
      ...defaultValues,
      birthdate: defaultValues.birthdate && new Date(defaultValues.birthdate),
    });
  }, [defaultValues]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nama" type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthdate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal Lahir</FormLabel>
                <AccountBirthdateFormField {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Gender</FormLabel>

                <FormControl>
                  <AccountGenderFormField {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="bg-gossamer-500 hover:bg-gossamer-500/90 w-fit"
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Perubahan
          </Button>
        </form>
      </Form>
    </>
  );
};

export default AccountContent;
