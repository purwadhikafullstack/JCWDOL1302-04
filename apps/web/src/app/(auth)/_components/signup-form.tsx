import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from "@/components/ui/input"
import { SignupSchema } from '@/schemas/auth-schema'
import { UseFormReturn } from 'react-hook-form'
import * as z from 'zod'

interface SignupFormProps {
  form: UseFormReturn<{
    role: string;
    name: string;
    email: string;
    password: string;
  }, any, undefined>;
  onSubmit: (values: z.infer<typeof SignupSchema>) => void;
  isPending: boolean;
}

const SignupForm = ({
  form,
  onSubmit,
  isPending
} : SignupFormProps) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-6'
      >
        <div className='space-y-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='Jhon Doe'
                    type='text'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          Sign Up
        </Button>
      </form>
    </Form>
  )
}

export default SignupForm
