import React, { useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SalesReportDataTable from "./data-table/Data-Table";
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { TSalesReportProperty } from "@/redux/slices/salesReport-slice";
import { formatCurrencyRp } from '@/lib/formatNumber';
import { useSession } from "next-auth/react";
import { getSalesReportProperties } from "@/redux/slices/salesReport-thunk";

const SalesReportTable = () => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const { salesReports } = useAppSelector((state) => state.salesReportReducer);

  useEffect(() => {
    if (session?.user)
      dispatch(getSalesReportProperties({
        token: session.user.accessToken!,
        userId: session.user.id
      }))
  }, [])

  const columns: ColumnDef<TSalesReportProperty>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            className="px-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Property Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('location')}</div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type Room',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('type')}</div>
      ),
    },
    {
      accessorKey: 'maxQuantity',
      header: ({ column }) => {
        return (
          <Button
            className="px-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Room Highest Qty Booking
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div>{row.getValue('maxQuantity')}</div>
      ),
    },
    {
      accessorKey: 'totalQuantity',
      header: ({ column }) => {
        return (
          <Button
            className="px-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Total Room Qty
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div>{row.getValue('totalQuantity')}</div>
      ),
    },
    {
      accessorKey: 'totalPenghasilan',
      header: ({ column }) => {
        return (
          <Button
            className="px-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Total Income
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div>{formatCurrencyRp(row.getValue('totalPenghasilan'))}</div>
      ),
    },
  ];

  return (
    <>
      <SalesReportDataTable columns={columns} data={salesReports} />
    </>
  );
};

export default SalesReportTable;
