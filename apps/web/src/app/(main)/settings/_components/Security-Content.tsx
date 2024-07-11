import React, { useState } from 'react';
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
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ChangePasswordSchema } from '@/schemas/change-password-schema';
import { UseFormReturn, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signout } from '@/actions/auth';
import { useAppDispatch } from '@/redux/hook';
import { changeUserpasswordThunk } from '@/redux/slices/settings-thunk';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';

const SecurityContent = () => {
  const { data: session } = useSession();

  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      password: '',
      password_confirm: '',
    },
  });

  const onSubmit = (values: z.infer<typeof ChangePasswordSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    onDialogOpenHandler(true);
  };

  const onDialogOpenHandler = (open: boolean) => setIsDialogOpen(open);

  const onSureClickHandler = () => {
    const values = form.getValues();

    if (session && values.password)
      dispatch(
        changeUserpasswordThunk({
          email: session.user.email,
          password: values.password,
        }),
      ).then(async (data: any) => {
        toast({
          variant: data.payload.error ? 'destructive' : 'default',
          title: data.payload.error ? data.payload.error : data.payload.success,
        });

        await signout();
      });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6"
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password Baru</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Password Baru"
                  type="password"
                  disabled={session?.user.provider === 'google'}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password_confirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konfirmasi Password Baru</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Konfirmasi Password Baru"
                  disabled={session?.user.provider === 'google'}
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="bg-gossamer-500 hover:bg-gossamer-500/90 w-fit"
          disabled={session?.user.provider === 'google'}
        >
          Ubah Password
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={onDialogOpenHandler}>
          <DialogContent>
            <DialogHeader className="gap-4">
              <DialogTitle>Apakah Anda benar-benar yakin?</DialogTitle>
              <DialogDescription>
                Tindakan ini tidak bisa dibatalkan. Tindakan ini akan mengubah
                akun anda secara permanen kemudian anda perlu melakukan
                verifikasi yang telah dikirim ke-email anda serta anda perlu
                melakukan sign in kembali.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose>
                <Button className="w-fit" variant={'ghost'}>
                  Batal
                </Button>
              </DialogClose>

              <Button
                className="bg-gossamer-500 hover:bg-gossamer-500/90 w-fit"
                disabled={session?.user.provider === 'google'}
                onClick={onSureClickHandler}
              >
                Yakin
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
};

export default SecurityContent;
