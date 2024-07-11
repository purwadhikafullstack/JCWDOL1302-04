import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { DialogClose } from '@radix-ui/react-dialog';
import { useRouter } from 'next/navigation';

interface FilterDialogProps {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  sortPrice: string;
  setSortPrice: (value: string) => void;
  nameParam: string;
  fromDateParam: string;
  toDateParam: string;
}

const FilterDialog = ({
  openDialog,
  setOpenDialog,
  sortPrice,
  setSortPrice,
  nameParam,
  fromDateParam,
  toDateParam,
}: FilterDialogProps) => {
  const router = useRouter();

  const handleOnOpenChange = (open: boolean) => {
    setOpenDialog(open);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (nameParam || fromDateParam) {
      router.push(
        `/property?sortPrice=${e.target.sortPrice.value}${nameParam}${fromDateParam}${toDateParam}`,
      );

      handleOnOpenChange(false);
      return;
    }

    router.push(`/property?sortPrice=${e.target.sortPrice.value}`);
    handleOnOpenChange(false);
  };

  return (
    <Dialog open={openDialog} onOpenChange={handleOnOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpenDialog(true)}>
          Filter
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div>
            <Label className="mb-2 block text-base">Harga</Label>
            <RadioGroup
              name="sortPrice"
              onValueChange={(value) => setSortPrice(value)}
              defaultValue={sortPrice}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="termurah" id="r1" />
                <Label htmlFor="r1">Termurah</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="termahal" id="r2" />
                <Label htmlFor="r2">Termahal</Label>
              </div>
            </RadioGroup>
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button aria-label="Close" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Search</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog;
