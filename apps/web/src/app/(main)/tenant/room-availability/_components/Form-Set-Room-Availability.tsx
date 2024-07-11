import React from 'react'
import { FromRoomAvailabilityPriceSchema } from "@/schemas/form-room-availability-price-schema";
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
import { patchRoomAvailability, postRoomAvailability } from "@/redux/slices/roomAvailability-thunk";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";

const FormSetRoomAvailability = ({
  form,
  handleOpenDialogSetAvailability,
  modalPopover,
  roomAvailaId,
  roomId,
}: {
  form: UseFormReturn<z.infer<typeof FromRoomAvailabilityPriceSchema>, any, undefined>;
  handleOpenDialogSetAvailability: (open: boolean) => void;
  modalPopover: boolean;
  roomAvailaId?: string;
  roomId?: string;
}) => {
  const {data: session} = useSession();
  const {propertiesRooms} = useAppSelector((state) => state.roomAvailabilityReducer);
  const dispatch = useAppDispatch();

  const onSubmit = (values: z.infer<typeof FromRoomAvailabilityPriceSchema>) => {
    if (roomAvailaId) {
      dispatch(patchRoomAvailability({ token: session?.user.accessToken!, payload: values, id: roomAvailaId}))
        .then((data: any) => {
          toast({
            variant: data.payload.error ? 'destructive' : 'default',
            title: data.payload.error ? data.payload.error : data.payload.success,
          });
        })
      handleOpenDialogSetAvailability(false);
      return
    }

    dispatch(postRoomAvailability({ token: session?.user.accessToken!, payload: values}))
      .then((data: any) => {
        toast({
          variant: data.payload.error ? 'destructive' : 'default',
          title: data.payload.error ? data.payload.error : data.payload.success,
        });
      })
    handleOpenDialogSetAvailability(false);
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
                            disabled={roomId
                              ? roomId === r.id
                                ? false : true
                              : r.roomAvailabilitiesId ? true : false
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
              <FormLabel>To Date</FormLabel>
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

export default FormSetRoomAvailability