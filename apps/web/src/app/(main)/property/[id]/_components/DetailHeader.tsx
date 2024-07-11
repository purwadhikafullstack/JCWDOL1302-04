// DetailHeader.tsx

import Image from 'next/image';
import React from 'react';
import { Star } from 'lucide-react';
import { TPropertyDetailClient } from '@/redux/slices/client/property-slice';
import { Separator } from '@/components/ui/separator';

interface DetailHeaderProps {
  property: TPropertyDetailClient;
  rating: number | '';
  points: number[];
}

const DetailHeader = ({ property, rating, points }: DetailHeaderProps) => (
  <div className="flex w-full flex-col gap-8 px-6 md:px-10 xl:px-20">
    <div className="relative flex h-80 w-full flex-col gap-5 overflow-hidden rounded-xl md:h-96 md:gap-14">
      <Image
        className="-z-10 h-full w-full object-cover object-center brightness-75"
        src={`http://localhost:8000/properties/${property.image}`}
        fill
        priority
        alt="hero"
      />
    </div>

    <p className="text-athens-gray-950 w-fit text-wrap text-3xl font-bold tracking-tight md:text-center">
      {property.name}
    </p>

    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
      <div className="flex flex-row items-center gap-3">
        <div className="bg-athens-gray-950 rounded-full px-6 py-2 text-white">
          {property.category}
        </div>
        <div className="border-athens-gray-950 text-athens-gray-950 rounded-full border-[1px] px-6 py-2">
          {property.location}
        </div>
      </div>

      {points.length > 0 ? (
        <div className="flex flex-row items-center gap-1">
          <div className="flex items-center gap-1">
            <Star className="text-yellow-400" size={18} />
            <span className="font-semibold text-slate-950">{rating}</span>
          </div>
          <span className="font-semibold text-slate-950">
            {' '}
            · {points.length} reviews
          </span>
        </div>
      ) : (
        <span className="font-semibold">New</span>
      )}
    </div>
    <Separator orientation="horizontal" />

    <div className="flex flex-row gap-3">
      <p className="text-athens-gray-500 text-wrap text-lg font-normal tracking-tight md:text-center">
        {property.description}
      </p>
    </div>

    <Separator orientation="horizontal" />
  </div>
);

export default DetailHeader;
