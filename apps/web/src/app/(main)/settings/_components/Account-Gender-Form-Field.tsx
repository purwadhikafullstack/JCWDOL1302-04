import React from 'react';
import { FormControl, FormItem, FormLabel } from '@/components/ui/form';

import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const AccountGenderFormField = (
  field: ControllerRenderProps<FieldValues, 'gender'>,
) => {
  return (
    <RadioGroup
      onValueChange={field.onChange}
      defaultValue={field.value}
      className="flex flex-col space-y-1"
    >
      <FormItem className="flex items-center space-x-3 space-y-0">
        <FormControl>
          <RadioGroupItem value="L" checked={field.value === 'L'} />
        </FormControl>
        <FormLabel className="font-normal">laki-Laki</FormLabel>
      </FormItem>
      <FormItem className="flex items-center space-x-3 space-y-0">
        <FormControl>
          <RadioGroupItem value="P" checked={field.value === 'P'} />
        </FormControl>
        <FormLabel className="font-normal">Perempuan</FormLabel>
      </FormItem>
    </RadioGroup>
  );
};

export default AccountGenderFormField;
