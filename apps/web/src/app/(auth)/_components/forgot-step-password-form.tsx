import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ChangePasswordSchema } from "@/schemas/change-password-schema";
import { EmailCheckSchema } from '@/schemas/email-check-schema';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

type ForgotStepPasswordFormProps = {
  formChangePassword: UseFormReturn<
    {
      password: string;
      password_confirm: string;
    },
    any,
    undefined
  >;
  onSubmitChangePassword: (values: z.infer<typeof ChangePasswordSchema>) => void;
  isPending: boolean;
  onPrevHandler: () => void;
};

const ForgotStepPasswordForm = ({
  formChangePassword,
  onSubmitChangePassword,
  isPending,
  onPrevHandler,
}: ForgotStepPasswordFormProps) => {
  return (
    <Form {...formChangePassword}>
      <form
        className="w-full space-y-6"
        onSubmit={formChangePassword.handleSubmit(onSubmitChangePassword)}
      >
        <FormField
          control={formChangePassword.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password Baru</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Password Baru" type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={formChangePassword.control}
          name="password_confirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konfirmasi Password Baru</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Konfirmasi Password Baru"
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="gap-y-2">
          <Button
            type="button"
            className="w-full sm:w-20"
            variant={'ghost'}
            onClick={onPrevHandler}
          >
            Back
          </Button>

          <Button
            type="submit"
            className={cn(
              'bg-gossamer-500 hover:bg-gossamer-500/90 w-full sm:w-20',
            )}
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Finish
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ForgotStepPasswordForm;
