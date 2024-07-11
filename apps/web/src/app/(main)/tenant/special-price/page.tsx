"use client"

import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { FormSpecialPriceSchema } from "@/schemas/specialPrice-schema"
import DialogCustomAdmin from "@/components/Dialog-Custom-Admin"
import FormSpecialPrice from "./_components/Form-Special-Priece"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { getPropretyRooms } from "@/redux/slices/roomAvailability-thunk"
import { useSession } from "next-auth/react"
import { getSpecialPrices } from "@/redux/slices/specialPrice-thunk"
import SpecialPriceTable from "./_components/SpecialPriceTable"

export type TEditForm = {
  roomId?: string;
  specialPriceId?: string;
  price?: string;
}

const initEditFormValues: TEditForm = {
  roomId: "",
  specialPriceId: "",
  price: "",
}

const SpecialPrice = () => {
  const [openDialogSetSpecialPrice, setOpenDialogSetSpecialPrice] = useState<boolean>(false);
  const [modalPopover, setModalPopover] = useState<boolean>(false);
  const [specialPriceId, setSpecialPriceId] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [editForm, setEditForm] = useState<TEditForm>(initEditFormValues)
  const {data: session} = useSession();
  const dispatch = useAppDispatch();
  const {refetch} = useAppSelector((state) => state.specialPriceReducer)

  const form = useForm<z.infer<typeof FormSpecialPriceSchema>>({
    resolver: zodResolver(FormSpecialPriceSchema),
  });

  const handleOpenDialogSetSpecialPrice = (open: boolean) => {
    setOpenDialogSetSpecialPrice(open);
    setModalPopover(false);
    form.reset();
    setEditForm(initEditFormValues);
  }

  useEffect(() => {
    if (session?.user) {
      dispatch(getPropretyRooms({token: session.user.accessToken!, userId: session.user.id}));
      dispatch(getSpecialPrices({token: session.user.accessToken!, userId: session.user.id}));
    }
  }, [dispatch, refetch])

  return (
    <main className="min-h-svh pt-[78px] px-6 md:px-10 xl:px-20 ">
      <DialogCustomAdmin
        titleDialogContent={editForm.specialPriceId ? "Edit special room price" : "Add special room price"}
        descripDialogContent={editForm.specialPriceId ? "" : "If the room field is empty, create your property and room first."}
        onOpenChange={handleOpenDialogSetSpecialPrice}
        open={openDialogSetSpecialPrice}
      >
        <FormSpecialPrice
          form={form}
          handleOpenDialogSetSpecialPrice={handleOpenDialogSetSpecialPrice}
          modalPopover={modalPopover}
          editForm={editForm}
        />
      </DialogCustomAdmin>
      <div className="my-6 flex md:flex-row flex-col justify-between md:items-center">
        <h1 className="text-lg md:text-2xl font-bold text-slate-900">Special Rooms Prices</h1>
        <Button
          onClick={() => {
            handleOpenDialogSetSpecialPrice(true);
            setModalPopover(true);
          }}
        >
          Add Special Price
        </Button>
      </div>
      <SpecialPriceTable
        form={form}
        setOpenDialogSetSpecialPrice={setOpenDialogSetSpecialPrice}
        editForm={editForm}
        setEditForm={setEditForm}
        setModalPopover={setModalPopover}
      />
    </main>
  )
}

export default SpecialPrice