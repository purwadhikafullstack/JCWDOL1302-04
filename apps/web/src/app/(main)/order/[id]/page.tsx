"use client"

import { Separator } from "@/components/ui/separator";
import { formatCurrencyRp } from "@/lib/formatNumber";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getOrderByClientOrderId } from "@/redux/slices/client/orderClient-thunk";
import { format } from "date-fns";
import locale from 'date-fns/locale/id'
import { ChevronRight, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react"
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from 'react'
import DialogReview from "./_components/Dialog-Review";
import { Button } from "@/components/ui/button";

const DetailOrder = ({ params }: { params: { id: string } }) => {
  const {data: session} = useSession();
  const { orderDetail, isLoading } = useAppSelector((state) => state.orderClientReducer)
  const { refetch } = useAppSelector((state) => state.reviewReducer)
  const dispatch = useAppDispatch();
  const { id } = params;

  useEffect(() => {
    if (session)
      dispatch(getOrderByClientOrderId({
        token: session.user.accessToken!,
        orderId: id
      }))
  }, [refetch])
  return (
    <main className="min-h-svh w-full pt-[78px]">
      {isLoading ? (
        <div className="flex min-h-[calc(100svh-79px)] w-full items-center justify-center">
          <Loader2 size={50} className="animate-spin" />
        </div>
      ) : (
        <div className="my-6 mx-auto px-4 md:max-w-xl">
          <div className="py-4 px-3 w-full border rounded-lg">
            <span 
              className={cn(
                'font-semibold',
                orderDetail.status === 'pending'
                  ? 'text-yellow-500'
                  : orderDetail.status === 'cancelled' ||
                  orderDetail.status === 'rejected' ||
                  orderDetail.status === 'expired'
                  ? 'text-red-700'
                  : 'text-gossamer-600'
              )}
            >
              {orderDetail.status === 'pending' ? (
                'Pending'
              ) : orderDetail.status === 'expired' ? (
                'Expired'
              ) : orderDetail.status === 'finished' ? (
                'Finished'
              ) : orderDetail.status === 'cancelled' ? (
                'Cancelled'
              ) : orderDetail.status === 'confirming' ? (
                'Confirming'
              ) : orderDetail.status === 'rejected' && (
                'Rejected'
              )}
            </span>
            <Separator className="my-3" />
            <div className="flex flex-col md:flex-row gap-2 md:justify-between text-sm">
              <span>Tanggal Pemesanan</span>
              <span>{orderDetail.createAt && format(orderDetail.createAt, "dd MMM yyyy, p", { locale: locale.id })}</span>
            </div>
            <div className="mt-2 flex flex-col md:flex-row gap-2 md:justify-between text-sm">
              <span>Check In</span>
              <span>{orderDetail.checkIn && format(orderDetail.checkIn, "EEE, dd MMM yyyy", { locale: locale.id })}</span>
            </div>
            <div className="mt-2 flex flex-col md:flex-row gap-2 md:justify-between text-sm">
              <span>Check Out</span>
              <span>{orderDetail.checkOut && format(orderDetail.checkOut, "EEE, dd MMM yyyy", { locale: locale.id })}</span>
            </div>
          </div>
          <div className="mt-2 py-4 px-3 w-full border rounded-lg">
            <div className="flex justify-between">
              <span className="font-semibold">Detail Produk</span>
              <Link href={`${window.location.origin}/property/${orderDetail.propertyId}`}>
                <span className="flex gap-1 items-center font-semibold">
                  {orderDetail.name}
                  <ChevronRight size={16} />
                </span>
              </Link>
            </div>
            {orderDetail.rooms.map((odr, i) => (
              <div className="w-full mt-3 py-2 px-3 border rounded-lg shadow-sm" key={i}>
                <div className="flex gap-2">
                  <div className="flex-1 relative max-w-[120px] h-[70px] rounded-md overflow-hidden">
                    <Image
                      alt={`${orderDetail.name+' '+odr.type}`}
                      src={`http://localhost:8000/rooms/${odr.image}`}
                      fill
                      sizes="100%"
                      style={{
                        objectFit: "fill"
                      }}
                    />
                  </div>
                  <div className="flex-1 flex-col">
                    <span className="text-sm font-semibold">{odr.type}</span>
                    <div className="text-sm">
                      <span>{odr.quantity} Kamar</span>
                      <span> x </span>
                      <span>{orderDetail.totalDays} Hari</span>
                      <span> x </span>
                      {odr.specialPrice ? (
                        <>
                          <span className="line-through text-slate-500">{formatCurrencyRp(odr.price)}</span>
                          <span> {formatCurrencyRp(odr.specialPrice)}</span>
                        </>
                      ):(
                        <span >{formatCurrencyRp(odr.price)}</span>
                      )}
                    </div>
                    <div className="mt-2 text-sm">
                      <span>Total harga: </span>
                      {odr.specialPrice ? (
                        <span className="font-semibold">
                          {formatCurrencyRp(odr.quantity * odr.totalPrice)}
                        </span>
                      ):(
                        <span className="font-semibold">
                          {formatCurrencyRp(odr.quantity * odr.totalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 py-4 px-3 w-full border rounded-lg">
            {orderDetail.rooms.map((odr, i) => (
              <div className="flex justify-between text-sm" key={i}>
                <span>Total Harga {`(${odr.type})`}</span>
                <span>{formatCurrencyRp(odr.quantity * odr.totalPrice)}</span>
              </div>
            ))}
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total Pembayaran</span>
              <span>{formatCurrencyRp(orderDetail.totalPayment)}</span>
            </div>
          </div>
          {(!orderDetail.reviewId && orderDetail.status === "finished") ? (
            <DialogReview orderId={orderDetail.orderId} allowed={new Date(orderDetail.checkIn) <= new Date()} />
          ):(
            ""
          )}
        </div>
      )}
    </main>
  )
}

export default DetailOrder