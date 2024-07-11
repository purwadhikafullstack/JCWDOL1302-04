'use client'

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import {
  changeUserpasswordThunk,
  checkEmailThunk,
} from '@/redux/slices/settings-thunk';
import { ChangePasswordSchema } from '@/schemas/change-password-schema';
import { EmailCheckSchema } from '@/schemas/email-check-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import ForgotStepEmailForm from './forgot-step-email-form';
import ForgotStepPasswordForm from './forgot-step-password-form';

interface ForgetButtonProps {}

const ForgetButton = ({}: ForgetButtonProps) => {
  const { toast } = useToast();

  const isPending = useAppSelector(
    (state) => state.settingsReaducer.isChangePasswordLoading,
  );

  const dispatch = useAppDispatch();

  const [currrentStep, setCurrrentStep] = useState(0);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const onDialogOpenHandler = (open: boolean) => {
    setCurrrentStep(0);
    setIsDialogOpen(open);
  };

  const [formStep, setFormStep] = useState([
    {
      title: 'email',
      verified: false,
    },
    {
      title: 'password',
      verified: false,
    },
  ]);

  const formEmailCheck = useForm<z.infer<typeof EmailCheckSchema>>({
    resolver: zodResolver(EmailCheckSchema),
    defaultValues: {
      email: '',
    },
  });

  const formChangePassword = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      password: '',
      password_confirm: '',
    },
  });

  const onSubmitEmailCheck = (values: z.infer<typeof EmailCheckSchema>) => {
    dispatch(checkEmailThunk({ email: values.email })).then((data: any) => {
      toast({
        variant: data.payload.error ? 'destructive' : 'default',
        title: data.payload.error ? data.payload.error : data.payload.success,
      });

      if (data.payload.error) {
        formEmailCheck.setError('email', {
          type: 'manual',
          message: data.payload.error,
        });
      } else {
        if (currrentStep < formStep.length - 1)
          setCurrrentStep(currrentStep + 1);
      }
    });
  };

  const onSubmitChangePassword = (
    values: z.infer<typeof ChangePasswordSchema>,
  ) => {
    dispatch(
      changeUserpasswordThunk({
        email: formEmailCheck.getValues().email,
        password: values.password,
      }),
    ).then((data: any) => {
      toast({
        variant: data.payload.error ? 'destructive' : 'default',
        title: data.payload.error ? data.payload.error : data.payload.success,
      });

      if (data.payload.error) {
        formChangePassword.setError('password', {
          type: 'manual',
          message: data.payload.error,
        });
        formChangePassword.setError('password_confirm', {
          type: 'manual',
          message: data.payload.error,
        });
      } else {
        setIsDialogOpen(false);
      }
    });
  };

  const onPrevHandler = () => {
    if (currrentStep > 0) setCurrrentStep(currrentStep - 1);
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={onDialogOpenHandler}>
        <DialogTrigger asChild>
          <Button
            variant="link"
            className="w-full font-normal underline lg:no-underline"
            size="sm"
          >
            Forget my password
          </Button>
        </DialogTrigger>
        <DialogContent
          className="gap-6"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogTitle>Forget Password</DialogTitle>
          {formStep.map((data, index) => {
            if (data.title === 'email' && currrentStep === index)
              return (
                <ForgotStepEmailForm
                  key={`${data.title}-${index}`}
                  formEmailCheck={formEmailCheck}
                  onSubmitEmailCheck={onSubmitEmailCheck}
                  onPrevHandler={onPrevHandler}
                  isPending={isPending}
                />
              );

            if (data.title === 'password' && currrentStep === index)
              return (
                <ForgotStepPasswordForm
                  key={`${data.title}-${index}`}
                  formChangePassword={formChangePassword}
                  onSubmitChangePassword={onSubmitChangePassword}
                  onPrevHandler={onPrevHandler}
                  isPending={isPending}
                />
              );
          })}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ForgetButton;
