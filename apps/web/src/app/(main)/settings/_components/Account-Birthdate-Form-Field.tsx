import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { id } from 'date-fns/locale';

const AccountBirthdateFormField = (
  field: ControllerRenderProps<FieldValues, 'birthdate'>,
) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={'outline'}
            className={cn(
              'w-[400px] pl-3 text-left font-normal',
              !field.value && 'text-muted-foreground',
            )}
          >
            {field.value ? (
              format(field.value, 'PPP')
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={field.value}
          locale={id}
          onSelect={(date) => {
            let newDate;

            if (date) {
              const year = date.getUTCFullYear();
              const month = date.getMonth();
              const day = date.getDate();
              newDate = new Date(Date.UTC(year, month, day, 0, 0, 0));
            }

            field.onChange(date ? newDate : date);
          }}
          disabled={(date) =>
            date > new Date() || date < new Date('1900-01-01')
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default AccountBirthdateFormField;
