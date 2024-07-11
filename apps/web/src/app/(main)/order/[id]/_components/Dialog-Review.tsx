import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { ReviewSchema } from "@/schemas/review-schema"
import { useAppDispatch } from "@/redux/hook"
import { postReview } from "@/redux/slices/client/review-thunk"
import { useSession } from "next-auth/react"

const DialogReview = ({
  orderId,
  allowed
}:{
  orderId: string;
  allowed: boolean;
}) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const form = useForm<z.infer<typeof ReviewSchema>>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      orderId
    }
  })

  const onSubmit = (values: z.infer<typeof ReviewSchema>) => {
    dispatch(postReview({ token: session?.user.accessToken!, payload: values}))
      .then((data: any) => {
        toast({
          variant: data.payload.error ? 'destructive' : 'default',
          title: data.payload.error ? data.payload.error : data.payload.success,
        });
      });
    handleOnOpenChange(false);
  }
  
  const handleOnOpenChange = (open: boolean) => {
    setOpenDialog(open);
  }
  return (
    <Dialog open={openDialog} onOpenChange={handleOnOpenChange}>
      <DialogTrigger className="w-full" asChild>
        <button
          onClick={() => setOpenDialog(true)}
          className="mt-2 text-gossamer-600 hover:bg-gossamer-100 w-full rounded-xl border-[1px] px-4 py-2 text-sm font-bold"
        >
          Review
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Review Property</DialogTitle>
          <DialogDescription>
            This review is only done once after check in.
          </DialogDescription>
        </DialogHeader>
        {allowed ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
              <FormField
                control={form.control}
                name="point"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Stars</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-2"
                      >
                        <FormItem className="relative">
                          <FormControl>
                            <RadioGroupItem className="absolute hidden" value="1" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            <Star
                              className={cn(
                                Number(field.value) >= 1
                                  ? 'text-yellow-400'
                                  : ''
                              )}
                            />
                          </FormLabel>
                        </FormItem>
                        <FormItem className="relative">
                          <FormControl>
                            <RadioGroupItem className="absolute hidden" value="2" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            <Star
                              className={cn(
                                Number(field.value) >= 2
                                  ? 'text-yellow-400'
                                  : ''
                              )}
                            />
                          </FormLabel>
                        </FormItem>
                        <FormItem className="relative">
                          <FormControl>
                            <RadioGroupItem className="absolute hidden" value="3" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            <Star
                              className={cn(
                                Number(field.value) >= 3
                                  ? 'text-yellow-400'
                                  : ''
                              )}
                            />
                          </FormLabel>
                        </FormItem>
                        <FormItem className="relative">
                          <FormControl>
                            <RadioGroupItem className="absolute hidden" value="4" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            <Star
                              className={cn(
                                Number(field.value) >= 4
                                  ? 'text-yellow-400'
                                  : ''
                              )}
                            />
                          </FormLabel>
                        </FormItem>
                        <FormItem className="relative">
                          <FormControl>
                            <RadioGroupItem className="absolute hidden" value="5" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            <Star
                              className={cn(
                                Number(field.value) >= 5
                                  ? 'text-yellow-400'
                                  : ''
                              )}
                            />
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little about your experience at our property "
                        className="w-full resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button className="bg-gossamer-500 rounded-full hover:bg-gossamer-500/90" type="submit">Submit</Button>
              </DialogFooter>
            </form>
          </Form>
        ):(
          <>
            <span>The review will be available when your payment is complete and you have check in</span>
            <span>Please come back later :)</span>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default DialogReview