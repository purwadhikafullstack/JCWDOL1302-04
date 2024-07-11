'use client';

import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { ArrowLeft, ArrowRight, Loader2, Star } from 'lucide-react';
import { Navigation } from 'swiper/modules';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { getPropertyDetailClientThunk } from '@/redux/slices/client/property-thunk';
import RoomCard from './_components/Room-Card';
import BookingFloating from './_components/Booking-Floating';
import { useRouter } from 'next/navigation';
import CardComment from '@/components/Card-Comment';
import { getReviewsByPropertyId } from '@/redux/slices/client/review-thunk';
import DetailHeader from './_components/DetailHeader';
import DetailRooms from './_components/DetailRooms';
import DetailReviews from './_components/DetailReviews';

const DetailPage = ({ params }: { params: { id: string } }) => {
  const [orderList, setOrderList] = useState<
    {
      id: string;
      type: string;
      price: number;
      quantity: number;
      amount: number;
    }[]
  >([]);

  const [totalPay, setTotalPay] = useState(0);

  const swiperRef = useRef<any>(null);
  const router = useRouter();

  const handlePrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const dispatch = useAppDispatch();
  const { properyDetail, isPropertyDetailLoading } = useAppSelector(
    (state) => state.propertiesClientSlice,
  );
  const { propertyReviews, isLoading: isLoadingComment } = useAppSelector(
    (state) => state.reviewReducer,
  );
  const points = propertyReviews.map((pr) => pr.point);
  const rating = points.length > 0 ? points.reduce((t, c) => t + c) / points.length : '';

  useEffect(() => {
    dispatch(getPropertyDetailClientThunk({ id: params.id }));
    dispatch(getReviewsByPropertyId(params.id));
  }, [params]);

  const handleRoomCardChange = ({
    id,
    amount,
    quantity,
    type,
    price,
  }: {
    id: string;
    type: string;
    price: number;
    amount: number;
    quantity: number;
  }) => {
    const existingIndex = orderList.findIndex((item) => item.id === id);

    if (quantity === 0 && amount === 0 && existingIndex !== -1) {
      const updatedOrderList = [...orderList];

      updatedOrderList.splice(existingIndex, 1);

      setOrderList(updatedOrderList);
    } else if (existingIndex !== -1) {
      const updatedOrderList = [...orderList];

      updatedOrderList[existingIndex] = { id, amount, quantity, type, price };

      setOrderList(updatedOrderList);
    } else if (quantity > 0) {
      setOrderList((prev) => [...prev, { id, amount, quantity, type, price }]);
    }
  };

  useEffect(() => {
    let newTotalPay = 0;

    for (const { amount } of orderList) {
      newTotalPay += amount;
    }
    setTotalPay(newTotalPay);
  }, [orderList]);

  return (
    <main className="mt-[78px] flex min-h-svh flex-col gap-6 py-5 pb-24 sm:pb-5">
      {isPropertyDetailLoading ? (
        <div className="flex min-h-[calc(100svh-79px)] w-full items-center justify-center">
          <Loader2 size={50} className="animate-spin" />
        </div>
      ) : (
        <>
          {properyDetail ? (
            <>
              <DetailHeader
                property={properyDetail}
                rating={rating}
                points={points}
              />

              <DetailRooms
                swiperRef={swiperRef}
                rooms={properyDetail.rooms}
                handleRoomCardChange={handleRoomCardChange}
                handlePrev={handlePrev}
                handleNext={handleNext}
              />

              <DetailReviews
                propertyReviews={propertyReviews}
                isLoadingComment={isLoadingComment}
                rating={rating}
              />

              {orderList.length > 0 && (
                <BookingFloating
                  totalPay={totalPay}
                  orderList={orderList}
                  pId={params.id}
                />
              )}
            </>
          ) : (
            <div className="flex min-h-[calc(100svh-79px)] w-full items-center justify-center">
              <h2 className="text-xl font-semibold">
                Opps. Property not found.
              </h2>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default DetailPage;
