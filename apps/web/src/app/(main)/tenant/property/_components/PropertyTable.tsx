import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { TProperty } from '@/redux/slices/tenant-slice';
import {
  deleteTenantDetailPropertyThunk,
  getTenantPropertiesThunk,
} from '@/redux/slices/tenant-thunk';
import { ColumnDef } from '@tanstack/react-table';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './Property-Table/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowUpDown,
  Delete,
  DoorOpen,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import UpdatePropertyForm from './UpdatePropertyForm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

const PropertyTable = () => {
  const { data: session } = useSession();
  const { toast } = useToast();

  const route = useRouter();
  const [isOpenDialog, setIsOpenDialog] = useState({ isOpen: false, pId: '' });

  const dispatch = useAppDispatch();

  const { properties, isLoadingCategories, categories } = useAppSelector(
    (state) => state.tenantReducer,
  );

  const onOpenChangeDialog = (open: boolean) =>
    setIsOpenDialog({ isOpen: open, pId: '' });

  const columns: ColumnDef<TProperty>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: 'propertyCategoryId',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Category
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },

      cell(props) {
        const { row } = props;

        const payment = row.original;

        return (
          <>
            {isLoadingCategories
              ? 'Loading...'
              : categories.filter(
                  (data) => data.id === payment.propertyCategoryId,
                )[0].name}
          </>
        );
      },
    },
    {
      accessorKey: 'description',
      header: 'Deskripsi',
    },
    {
      accessorKey: 'location',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Location
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: 'image',
      header: 'Image',
      // http://localhost:8000/user-images/${session.user.image}

      cell(props) {
        const { row } = props;

        const payment = row.original;

        return (
          <Popover>
            <PopoverTrigger>{payment.image}</PopoverTrigger>
            <PopoverContent>
              <div className="relative h-auto w-full">
                <Image
                  className="!relative object-contain"
                  src={`http://localhost:8000/properties/${payment.image}`}
                  fill
                  sizes="100%"
                  alt={`image-${payment.id}`}
                />
              </div>
            </PopoverContent>
          </Popover>
        );
      },
    },
    {
      id: 'actions',
      header: 'Action',
      cell(props) {
        const { row } = props;

        const payment = row.original;

        return (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {/* <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payment.id)}
              >
                Copy payment ID
              </DropdownMenuItem> */}
              <Link href={`/tenant/property/${payment.id}/room`}>
                <DropdownMenuItem
                // onClick={() => navigator.clipboard.writeText(payment.id)}
                >
                  <DoorOpen className="mr-2 h-4 w-4" />
                  <span>Room</span>
                </DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator />

              <Link href={`/tenant/property/${payment.id}`}>
                <DropdownMenuItem>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                className="focus:bg-red-100"
                onClick={() =>
                  setIsOpenDialog({ isOpen: true, pId: payment.id })
                }
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div>
      <DataTable columns={columns} data={properties} />
      <Dialog open={isOpenDialog.isOpen} onOpenChange={onOpenChangeDialog}>
        <DialogContent>
          <DialogHeader className="gap-4">
            <DialogTitle>Apakah Anda benar-benar yakin?</DialogTitle>
            <DialogDescription>
              Tindakan ini tidak bisa dibatalkan. Tindakan ini akan menghapus
              data anda secara permanen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>
              <Button className="w-fit" variant={'ghost'}>
                Batal
              </Button>
            </DialogClose>

            <Button
              className="bg-gossamer-500 hover:bg-gossamer-500/90 w-fit"
              disabled={session?.user.provider === 'google'}
              onClick={() => {
                dispatch(
                  deleteTenantDetailPropertyThunk({
                    id: session?.user.id!,
                    pId: isOpenDialog.pId,
                    token: session?.user.accessToken!,
                  }),
                ).then((data: any) => {
                  toast({
                    variant: data.payload.error ? 'destructive' : 'default',
                    title: data.payload.error
                      ? data.payload.error
                      : data.payload.success,
                  });
                });

                route.refresh();
                onOpenChangeDialog(false);
              }}
            >
              Yakin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyTable;
