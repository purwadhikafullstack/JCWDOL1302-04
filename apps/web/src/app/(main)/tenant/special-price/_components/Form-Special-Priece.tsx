import React from 'react'
import { FormSpecialPriceSchema } from "@/schemas/specialPrice-schema";
import { UseFormReturn } from "react-hook-form";
import z from "zod"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from "@/components/ui/select"
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { patchSpecialPrice, postSpecialPrice } from "@/redux/slices/specialPrice-thunk";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { TEditForm } from "../page";
import { formatCurrencyRp } from "@/lib/formatNumber";

const FormSpecialPrice = ({
  form,
  handleOpenDialogSetSpecialPrice,
  modalPopover,
  editForm
}: {
  form: UseFormReturn<z.infer<typeof FormSpecialPriceSchema>, any, undefined>;
  handleOpenDialogSetSpecialPrice: (open: boolean) => void;
  modalPopover: boolean;
  editForm: TEditForm;
}) => {
  const {data: session} = useSession();
  const {propertiesRooms} = useAppSelector((state) => state.roomAvailabilityReducer);
  const dispatch = useAppDispatch();

  const onSubmit = (values: z.infer<typeof FormSpecialPriceSchema>) => {
    if (editForm.specialPriceId) {
      dispatch(patchSpecialPrice({ token: session?.user.accessToken!, payload: values, id: editForm.specialPriceId}))
        .then((data: any) => {
          toast({
            variant: data.payload.error ? 'destructive' : 'default',
            title: data.payload.error ? data.payload.error : data.payload.success,
          });
        })
      handleOpenDialogSetSpecialPrice(false);
      return
    }

    dispatch(postSpecialPrice({ token: session?.user.accessToken!, payload: values}))
      .then((data: any) => {
        toast({
          variant: data.payload.error ? 'destructive' : 'default',
          title: data.payload.error ? data.payload.error : data.payload.success,
        });
      })
    handleOpenDialogSetSpecialPrice(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="roomId"
          render={({field}) => (
            <FormItem>
              <FormLabel>Room</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {propertiesRooms.map((pr, i) => (
                    <SelectGroup key={i}>
                      <SelectLabel>{pr.name}</SelectLabel>
                      <>
                        {pr.rooms.map((r) => (
                          <SelectItem 
                            key={r.id}
                            value={r.id}
                            disabled={editForm.roomId 
                              ? editForm.roomId === r.id
                                ? false : true
                              : false
                            }
                          >
                            {r.type}
                          </SelectItem>
                        ))}
                      </>
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  placeholder={editForm.price && formatCurrencyRp(+editForm.price)}
                  type="number" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fromDate"
          render={({field}) => (
            <FormItem className="flex flex-col">
              <FormLabel>From Date</FormLabel>
              <Popover modal={modalPopover}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent avoidCollisions={true} className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => {
                      if (date < addDays(new Date(), 1)) return true;
                      return false;
                    }}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="toDate"
          render={({field}) => (
            <FormItem className="flex flex-col">
              <FormLabel>To Date <span className="text-slate-500">(Optional)</span></FormLabel>
              <Popover modal={modalPopover}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent avoidCollisions={true} className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => {
                      if (form.getValues("fromDate")) 
                        if (date <= form.getValues("fromDate")) return true;
                      if (date < addDays(new Date(), 1)) return true;
                      return false;
                    }}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button aria-label="Close" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

export default FormSpecialPrice