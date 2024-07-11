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
import { EmailCheckSchema } from '@/schemas/email-check-schema';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

type ForgotStepEmailFormProps = {
  formEmailCheck: UseFormReturn<
    {
      email: string;
    },
    any,
    undefined
  >;
  onSubmitEmailCheck: (values: z.infer<typeof EmailCheckSchema>) => void;
  isPending: boolean;
  onPrevHandler: () => void;
};

const ForgotStepEmailForm = ({
  formEmailCheck,
  onSubmitEmailCheck,
  isPending,
  onPrevHandler,
}: ForgotStepEmailFormProps) => {
  return (
    <Form {...formEmailCheck}>
      <form
        className="w-full space-y-6"
        onSubmit={formEmailCheck.handleSubmit(onSubmitEmailCheck)}
      >
        <FormField
          control={formEmailCheck.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="jhondoe@gmail.com"
                  type="email"
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
            disabled={isPending}
            className={cn(
              'bg-blue-ribbon-500 hover:bg-blue-ribbon-500/90 w-full sm:w-20',
            )}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Next
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ForgotStepEmailForm;
