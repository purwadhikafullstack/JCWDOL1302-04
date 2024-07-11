import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { formatCurrencyRp } from '@/lib/formatNumber';
import { MinusIcon, PlusIcon } from 'lucide-react';

const RoomCard = ({
  id,
  type,
  description,
  price,
  image,
  onChange,
}: {
  id: string;
  type: string;
  description: string;
  price: number;
  image: string;
  onChange?: (props: { amount: number; quantity: number }) => void;
}) => {
  const [isOrder, setIsOrder] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [amount, setAmount] = useState(0);

  const handleIsOrder = () => {
    setQuantity(1);
    setIsOrder(true);
  };

  const handleDec = () => {
    if (quantity > 0) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleInc = () => {
    setQuantity((prev) => prev + 1);
  };

  useEffect(() => {
    if (quantity > 0) {
      const newAmount = price * quantity;
      setAmount(newAmount);

      if (onChange) {
        onChange({ amount: newAmount, quantity });
      }
    } else {
      setAmount(0);
      setIsOrder(false);
      if (onChange) {
        onChange({ amount: 0, quantity: 0 });
      }
    }
  }, [quantity]);

  useEffect(() => {
    // Check if quantity and amount are both 0, then remove from orderList
    if (quantity === 0 && amount === 0 && onChange) {
      onChange({ amount: 0, quantity: 0 });
    }
  }, [quantity, amount]);

  return (
    <div className="relative h-80 w-full overflow-hidden rounded-xl opacity-50 transition-all duration-500 ease-in-out [.swiper-slide-active_&]:opacity-100">
      <Image
        className="-z-10 h-full w-full rounded-xl object-cover object-center brightness-75"
        src={`http://localhost:8000/rooms/${image}`}
        fill
        sizes="100%"
        alt={`slide-${id}`}
      />
      <div className="relative flex h-full w-full flex-col items-end gap-4 p-6 opacity-0 transition-all sm:flex-row sm:gap-0 [.swiper-slide-active__&]:opacity-100">
        <div className="flex h-full w-full flex-col justify-end gap-2">
          <p className="text-xl font-bold tracking-tight text-white md:text-2xl">
            Room {type}
          </p>
          <p className="text-white/80">{description}</p>

          <div className="flex flex-col gap-1 text-base font-semibold text-white md:flex-row md:items-center md:gap-4 md:text-base">
            <span>{formatCurrencyRp(price)} /day (normal price)</span>
          </div>
        </div>
        {isOrder ? (
          <div className="flex w-full items-center justify-center gap-2 rounded-md bg-white sm:w-fit">
            <Button
              className="aspect-square"
              variant={'ghost'}
              onClick={handleDec}
            >
              <MinusIcon />
            </Button>
            <p className="text-nowrap align-bottom font-bold">
              {quantity}{' '}
              <span className="text-athens-gray-500 text-sm">kamar</span>
            </p>
            <Button
              className="aspect-square"
              variant={'ghost'}
              onClick={handleInc}
            >
              <PlusIcon />
            </Button>
          </div>
        ) : (
          <Button
            className="bg-gossamer-500 hover:bg-gossamer-500/90 rounded-full"
            onClick={handleIsOrder}
          >
            Order
          </Button>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
