'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CardWrapper from './card-wrapper';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignupSchema } from '@/schemas/auth-schema';
import SignupForm from './signup-form';
import { singup } from '@/actions/auth';
import { useTransition } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Home, UserRound } from 'lucide-react';


const SignupTab = () => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
    },
  });

  const onSubmit = (values: z.infer<typeof SignupSchema>) => {
    startTransition(() => {
      singup(values).then((data) => {
        toast({
          variant: data?.error ? 'destructive' : 'default',
          title: data?.error ? data?.error : data?.success,
        });
      });
    });
  };

  return (
    <div className="mx-8 flex flex-1 min-h-svh items-center justify-center py-[61.46px] md:mx-12">
      <Tabs defaultValue="user" className="md:w-[400px] w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="user"
            className="items-center gap-2 align-middle"
            onFocus={() => form.setValue('role', 'user')}
          >
            <UserRound size={20} />
            User
          </TabsTrigger>
          <TabsTrigger
            value="tenant"
            className="items-center gap-2 align-middle"
            onFocus={() => form.setValue('role', 'tenant')}
          >
            <Home size={20} />
            Tenant
          </TabsTrigger>
        </TabsList>
        <TabsContent value="user">
          <CardWrapper
            backButtonLabel="Sign In now!"
            backButtonLink="/signin"
            showSocial
          >
            <SignupForm form={form} onSubmit={onSubmit} isPending={isPending} />
          </CardWrapper>
        </TabsContent>
        <TabsContent value="tenant">
          <CardWrapper
            backButtonLabel="Sign In now!"
            backButtonLink="/signin"
            // showSocial
          >
            <SignupForm form={form} onSubmit={onSubmit} isPending={isPending} />
          </CardWrapper>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SignupTab;
