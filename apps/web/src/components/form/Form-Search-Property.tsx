import React, { useEffect } from 'react';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';
import { DatePickerWithRange } from '../Datepicker-range';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { useRouter, useSearchParams } from 'next/navigation';

const FormSearchProperty = ({
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
    <div className={cn('', className)}>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="hover:bg-athens-gray-100 flex h-auto items-center justify-center rounded-full border-none bg-transparent px-9 py-4 placeholder:capitalize focus:border-none focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="find property"
      />
      <Separator orientation="vertical" className="my-2.5 h-auto" />
      <DatePickerWithRange date={date} setDate={setDate} />
      {/* <Separator orientation="vertical" className="my-2.5 h-auto" />
      <Input
        className="hover:bg-athens-gray-100 flex h-auto items-center justify-center rounded-full border-none bg-transparent px-9 py-4 placeholder:capitalize focus:border-none focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="jumlah kamar"
        type="number"
      /> */}
      <div className="flex h-auto pr-2">
        <Button
          onClick={handleOnSearch}
          className="bg-gossamer-500 hover:bg-gossamer-500/90 flex gap-1.5 rounded-full"
        >
          <Search size={16} />
          <span>Cari</span>
        </Button>
      </div>
    </div>
  );
};

export default FormSearchProperty;
