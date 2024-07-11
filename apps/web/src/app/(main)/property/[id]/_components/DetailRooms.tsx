import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Navigation } from 'swiper/modules';
import { Button } from '@/components/ui/button';
import RoomCard from './Room-Card';
import { cn } from '@/lib/utils';
import { TRoomClient } from '@/redux/slices/client/property-slice';

interface DetailRoomsProps {
  swiperRef: React.RefObject<any>;
  rooms: TRoomClient[];
  handleRoomCardChange: (room: {
    id: string;
    type: string;
    price: number;
    amount: number;
    quantity: number;
  }) => void;
  handlePrev: () => void;
  handleNext: () => void;
}

const DetailRooms = ({
  swiperRef,
  rooms,
  handleRoomCardChange,
  handlePrev,
  handleNext,
}: DetailRoomsProps) => (
  <div className="flex flex-col gap-6 px-6 md:px-10 xl:px-20">
    <div className="flex w-full flex-col gap-4">
      <p className="text-athens-gray-950 text-2xl font-bold tracking-tight">
        Rooms
      </p>
    </div>
    <div className="group/navigation relative">
      <Swiper
        className="!h-full !w-full rounded-xl"
        ref={swiperRef}
        spaceBetween={16}
        slidesPerView={'auto'}
        centeredSlidesBounds
        centeredSlides
        modules={[Navigation]}
        onSlideChange={() => {}}
        onSwiper={(swiper) => {}}
      >
        {rooms.map(
          ({ id, type, description, roomPrice: price, image }, index) => (
            <SwiperSlide
              key={`${id}-${index}`}
              className={cn('!flex !w-[50%] items-center justify-center')}
            >
              <RoomCard
                id={id}
                type={type}
                description={description}
                price={price}
                image={image}
                onChange={({ amount, quantity }) => {
                  handleRoomCardChange({ id, amount, quantity, type, price });
                }}
              />
            </SwiperSlide>
          ),
        )}
      </Swiper>
      <div className="absolute -left-6 top-1/2 z-20 -translate-y-1/2 opacity-0 transition-all ease-in-out group-hover/navigation:opacity-100">
        <Button
          className="z-10 aspect-square w-fit rounded-full p-0"
          onClick={() => handlePrev()}
        >
          <ArrowLeft size={16} />
        </Button>
      </div>
      <div className="absolute -right-6 top-1/2 z-20 -translate-y-1/2 opacity-0 transition-all ease-in-out group-hover/navigation:opacity-100">
        <Button
          className="z-10 aspect-square w-fit rounded-full p-0"
          onClick={() => handleNext()}
        >
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  </div>
);

export default DetailRooms;
