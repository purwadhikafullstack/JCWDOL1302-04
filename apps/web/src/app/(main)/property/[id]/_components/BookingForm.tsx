import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Form, FormField, FormItem } from '@/components/ui/form';
import { BookingDateRangeSchema } from '@/schemas/transaction-schema';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { countDaysInRange } from '@/lib/countDaysInRange';
import * as z from 'zod';
import { UseFormReturn } from 'react-hook-form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { addDays, format } from 'date-fns';

interface BookingFormProps {
  form: UseFormReturn<z.infer<typeof BookingDateRangeSchema>>;
  onSubmit: (values: z.infer<typeof BookingDateRangeSchema>) => void; // adjust onSubmit function as needed
  daysBooking: number;
  setDaysBooking: React.Dispatch<React.SetStateAction<number>>;
}

const BookingForm: React.FC<BookingFormProps> = ({
  form,
  onSubmit,
  daysBooking,
  setDaysBooking,
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
        <FormField
          control={form.control}
          name="dateRange"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={'outline'}
                    className={cn(
                      'hover:bg-athens-gray-100 flex h-fit min-w-72 items-center justify-center rounded-full bg-transparent px-9 py-4 text-left font-normal',
                      !field.value && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value?.from ? (
                      field.value.to ? (
                        <>
                          {format(field.value.from, 'LLL dd, y')} -{' '}
                          {format(field.value.to, 'LLL dd, y')}
                        </>
                      ) : (
                        format(field.value.from, 'LLL dd, y')
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={field.value?.from}
                    selected={field.value}
                    onSelect={(range) => {
                      if (range) {
                        const days = countDaysInRange(range.from, range.to);
                        setDaysBooking(days);
                      }

                      field.onChange(range);
                    }}
                    numberOfMonths={2}
                    disabled={(date) => {
                      const today = new Date();
                      return date < addDays(today, 1);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="bg-gossamer-500 hover:bg-gossamer-500/90 h-fit rounded-full px-10 py-4 text-base sm:text-xl"
        >
          Booking
        </Button>
      </form>
    </Form>
  );
};

export default BookingForm;
