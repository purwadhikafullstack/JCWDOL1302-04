// components/OrderItem.tsx
import React from 'react';
import { formatCurrencyRp } from '@/lib/formatNumber';
import { cn } from '@/lib/utils';

interface OrderItemProps {
  name: string;
  specialPrice?: number | null;
  originalPrice: number;
  quantity: number;
  price: number;
  daysBooking: number;
}

const OrderItem = ({
  name,
  specialPrice,
  originalPrice,
  quantity,
  price,
  daysBooking,
}: OrderItemProps) => (
  <div className="flex items-center justify-between rounded-md border-[1px] px-4 py-2">
    <p className="text-xs font-semibold">{name}</p>
    <div className="flex items-center gap-1">
      <p className={cn('inline-flex gap-2 text-xs font-semibold')}>
        {specialPrice && (
          <span
            className={cn(
              'text-athens-gray-400',
              specialPrice && 'line-through',
            )}
          >
            {formatCurrencyRp(originalPrice)}
          </span>
        )}
        <span className="text-athens-gray-950">
          {formatCurrencyRp(specialPrice ?? originalPrice)}
        </span>
      </p>
      <p className="text-athens-gray-400 text-xs font-semibold">
        x {quantity} kamar x {daysBooking} hari :
      </p>
      <p className="text-sm font-semibold">{formatCurrencyRp(price)}</p>
    </div>
  </div>
);

export default OrderItem;
