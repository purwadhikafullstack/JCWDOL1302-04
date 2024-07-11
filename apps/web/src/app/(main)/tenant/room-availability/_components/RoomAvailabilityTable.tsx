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
import RoomAvailabilityDataTable from "./data-table/Data-Table"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { TRoomAvailability } from "@/redux/slices/roomAvailability-slice"
import { format } from "date-fns"
import { useState } from "react"
import AlertDialogDelete from "@/components/Alert-Dialog-Delete"
import { deleteRoomAvailability } from "@/redux/slices/roomAvailability-thunk"
import { useSession } from "next-auth/react"
import { toast } from "@/components/ui/use-toast"
import { z } from "zod"
import { FromRoomAvailabilityPriceSchema } from "@/schemas/form-room-availability-price-schema"
import { UseFormReturn } from "react-hook-form"

const RoomAvailableTable = ({
  form,
  setOpenDialogSetAvailability,
  roomAvailaId,
  setRoomAvailaId,
  setRoomId,
  setModalPopover,
}:{
  form: UseFormReturn<z.infer<typeof FromRoomAvailabilityPriceSchema>, any, undefined>;
  setOpenDialogSetAvailability: React.Dispatch<React.SetStateAction<boolean>>;
  roomAvailaId: string;
  setRoomAvailaId: React.Dispatch<React.SetStateAction<string>>;
  setRoomId: React.Dispatch<React.SetStateAction<string>>;
  setModalPopover: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const {roomAvailabilities} = useAppSelector((state) => state.roomAvailabilityReducer);
  const {data: session} = useSession();
  const dispatch = useAppDispatch();

  const handleOnOpenChangeAlert = (open: boolean) => {
    setOpenAlert(open);
    setRoomAvailaId("");
  }

  const handleShowAlertDelete = (id: string) => {
    handleOnOpenChangeAlert(true);
    setRoomAvailaId(id);
  }

  const onDelete = () => {
    dispatch(deleteRoomAvailability({token: session?.user.accessToken!, id: roomAvailaId}))
      .then((data: any) => {
        toast({
          variant: data.payload.error ? 'destructive' : 'default',
          title: data.payload.error ? data.payload.error : data.payload.success,
        });
      })
    handleOnOpenChangeAlert(false);
  }

  const columns: ColumnDef<TRoomAvailability>[] = [
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
        <div className="capitalize">{format(row.getValue("toDate"), "PPP")}</div>
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
                  setRoomId(roomAvaila.roomId)
                  setRoomAvailaId(roomAvaila.roomAvailaId);
                  setOpenDialogSetAvailability(true);
                  setModalPopover(true);
                }}
              >
                <Pencil size={16} />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => handleShowAlertDelete(roomAvaila.roomAvailaId)}
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
        alertDialodDescrip="This action cannot be undone. This will permanently delete room availability from our servers."
        onOpenChange={handleOnOpenChangeAlert}
        open={openAlert}
        onDelete={onDelete}
      />
      <RoomAvailabilityDataTable columns={columns} data={roomAvailabilities} />
    </>
  )
}

export default RoomAvailableTable
