import React, { useEffect } from 'react';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';
import { DatePickerWithRange } from '../Datepicker-range';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { useRouter, useSearchParams } from 'next/navigation';

const FormSearchPropertyMobile = ({
  className,
}: React.HTMLAttributes<HTMLDivElement>) => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [name, setName] = React.useState<string | undefined>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nameParam = searchParams.get('name');
  const fromDateParam = searchParams.get('fromDate');
  const toDateParam = searchParams.get('toDate');

  const handleOnSearch = () => {
    if (name && date?.from && date.to) {
      router.push(
        `/property?name=${name}&fromDate=${date.from.toISOString()}&toDate=${date.to.toISOString()}`,
      );
    } else if (!name && date?.from && date.to) {
      router.push(
        `/property?fromDate=${date.from.toISOString()}&toDate=${date.to.toISOString()}`,
      );
    } else if (name && date?.from && !date.to) {
      router.push(`/property?name=${name}&fromDate=${date.from.toISOString()}`);
    } else if (!name && date?.from && !date.to) {
      router.push(`/property?fromDate=${date.from.toISOString()}`);
    } else if (name && !date?.from && !date?.to) {
      router.push(`/property?name=${name}`);
    } else {
      router.push(`/property`);
    }
  };

  useEffect(() => {
    if (nameParam) setName(nameParam);
    if (fromDateParam) setDate({ from: new Date(fromDateParam) });
    if (toDateParam)
      setDate({ from: new Date(fromDateParam!), to: new Date(toDateParam) });
  }, []);

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="flex flex-col gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="hover:bg-athens-gray-100 flex h-auto items-center justify-center rounded-full bg-transparent px-9 py-4 placeholder:capitalize focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="cari destinasi"
        />
        <DatePickerWithRange date={date} setDate={setDate} isOutline />
      </div>

      <Button className="bg-gossamer-500 hover:bg-gossamer-500/90 flex w-full gap-1.5 rounded-full">
        <Search size={16} />
        <span>Cari</span>
      </Button>
    </div>
  );
};

export default FormSearchPropertyMobile;
