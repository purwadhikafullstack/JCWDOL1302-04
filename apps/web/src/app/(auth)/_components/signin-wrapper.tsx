"use client"

import { useTransition } from "react"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { SigninSchema } from "@/schemas/auth-schema"
import CardWrapper from './card-wrapper'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { signin } from "@/actions/auth"

const SigninWrapper = () => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof SigninSchema>>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof SigninSchema>) => {
    startTransition(() => {
      signin(values).then((data) => {
        if (data?.error) {
          toast({
            variant: data.error ? 'destructive' : 'default',
            title: data.error && data.error,
          });
        }
      });
    });
  };

  return (
    <div className='mx-8 flex flex-1 min-h-svh items-center justify-center py-[61.46px] md:mx-12'>
      <CardWrapper
        backButtonLabel="Don't have an account?"
        backButtonLink='/signup'
        showSocial
        isLogin
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='jhondoe@gmail.com'
                        type='email'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='******'
                        type='password'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              disabled={isPending}
              type='submit'
              className="w-full bg-gossamer-500 hover:bg-gossamer-500/90 rounded-full"
            >
              Sign In
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  )
}

export default SigninWrapper