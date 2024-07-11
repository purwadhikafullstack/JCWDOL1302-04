import React from 'react'
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import SpecialPriceDataTable from "./data-table/Data-Table"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { TSpecialPrice } from "@/redux/slices/specialPrice-slice"
import { format } from "date-fns"
import { useState } from "react"
import AlertDialogDelete from "@/components/Alert-Dialog-Delete"
import { deleteSpecialPrice } from "@/redux/slices/specialPrice-thunk"
import { useSession } from "next-auth/react"
import { toast } from "@/components/ui/use-toast"
import { z } from "zod"
import { FormSpecialPriceSchema } from "@/schemas/specialPrice-schema"
import { UseFormReturn } from "react-hook-form"
import { formatCurrencyRp } from "@/lib/formatNumber"
import { TEditForm } from "../page"

const SpecialPriceTable = ({
  form,
  setOpenDialogSetSpecialPrice,
  editForm,
  setEditForm,
  setModalPopover,
}:{
  form: UseFormReturn<z.infer<typeof FormSpecialPriceSchema>, any, undefined>;
  setOpenDialogSetSpecialPrice: React.Dispatch<React.SetStateAction<boolean>>;
  editForm: TEditForm
  setEditForm: React.Dispatch<React.SetStateAction<TEditForm>>;
  setModalPopover: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const {specialPrices} = useAppSelector((state) => state.specialPriceReducer);
  const {data: session} = useSession();
  const dispatch = useAppDispatch();

  const handleOnOpenChangeAlert = (open: boolean) => {
    setOpenAlert(open);
    setEditForm({});
  }

  const handleShowAlertDelete = (id: string) => {
    handleOnOpenChangeAlert(true);
    setEditForm({specialPriceId: id});
  }

  const onDelete = () => {
    dispatch(deleteSpecialPrice({token: session?.user.accessToken!, id: editForm.specialPriceId!}))
      .then((data: any) => {
        toast({
          variant: data.payload.error ? 'destructive' : 'default',
          title: data.payload.error ? data.payload.error : data.payload.success,
        });
      })
    handleOnOpenChangeAlert(false);
  }

  const columns: ColumnDef<TSpecialPrice>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            className="px-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Property Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "type",
      header: ({ column }) => {
        return (
          <Button
            className="px-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Type Room
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="capitalize">{row.getValue("type")}</div>,
    },
    {
      accessorKey: "price",
      header: "Special Price",
      cell: ({ row }) => (
        <div className="capitalize">{formatCurrencyRp(row.getValue("price"))}</div>
      ),
    },
    {
      accessorKey: "fromDate",
      header: "From Date",
      cell: ({ row }) => (
        <div className="capitalize">{format(row.getValue("fromDate"), "PPP")}</div>
      ),
    },
    {
      accessorKey: "toDate",
      header: "To Date",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("toDate") ? format(row.getValue("toDate"), "PPP") : "-"}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const roomAvaila = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => {
                  form.setValue('roomId', roomAvaila.roomId);
                  setEditForm({
                    price: String(roomAvaila.price),
                    roomId: roomAvaila.roomId,
                    specialPriceId: roomAvaila.specialPriceId,
                  })
                  setOpenDialogSetSpecialPrice(true);
                  setModalPopover(true);
                }}
              >
                <Pencil size={16} />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => handleShowAlertDelete(roomAvaila.specialPriceId)}
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <>
      <AlertDialogDelete
        alertDialodDescrip="This action cannot be undone. This will permanently delete special room price from our servers."
        onOpenChange={handleOnOpenChangeAlert}
        open={openAlert}
        onDelete={onDelete}
      />
      <SpecialPriceDataTable columns={columns} data={specialPrices} />
    </>
  )
}

export default SpecialPriceTable
