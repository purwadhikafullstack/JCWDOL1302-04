"use client"

import AlertDialogDelete from "@/components/Alert-Dialog-Delete"
import DialogCustomAdmin from "@/components/Dialog-Custom-Admin"
import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { deletePropertyCategoryThunk, getPropertyCategoryThunk, patchPropertyCategoryThunk, postPropertyCategoryThunk } from "@/redux/slices/propertyCategory-thunk"
import { PropertyCategorySchema } from "@/schemas/propertyCategory-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, SquarePen, Trash2, X } from "lucide-react"
import { useSession } from "next-auth/react"
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import * as z from 'zod'

const PropertyCategory = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [idPropertyCategory, setIdPropertyCategory] = useState<string>("")
  const { data: session } = useSession();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { data: propertyCategories, isLoading } = useAppSelector((state) => state.propertyCategoryReducer);

  const form = useForm<z.infer<typeof PropertyCategorySchema>>({
    resolver: zodResolver(PropertyCategorySchema),
    defaultValues: {
      id: "",
      name: ""
    }
  });

  const onSubmit = (values: z.infer<typeof PropertyCategorySchema>) => {
    if (values.id) {
      dispatch(patchPropertyCategoryThunk({ token: session?.user.accessToken!, payload: values }))
        .then((data: any) => {
          toast({
            variant: data.payload.error ? 'destructive' : 'default',
            title: data.payload.error ? data.payload.error : data.payload.success,
          });
        })
      handleOnOpenChange(false);
      return
    }

    dispatch(postPropertyCategoryThunk({ token: session?.user.accessToken!, payload: values }))
      .then((data: any) => {
        toast({
          variant: data.payload.error ? 'destructive' : 'default',
          title: data.payload.error ? data.payload.error : data.payload.success,
        });
      })

    handleOnOpenChange(false);
  };

  const onDelete = () => {
    dispatch(deletePropertyCategoryThunk({ token: session?.user.accessToken!, payload: { id: idPropertyCategory } }))
      .then((data: any) => {
        toast({
          variant: data.payload.error ? 'destructive' : 'default',
          title: data.payload.error ? data.payload.error : data.payload.success,
        });
      })
    handleOnOpenChangeAlert(false);
  } 

  const handleOnOpenChange = (open: boolean) => {
    setOpen(open);
    form.reset();
  }

  const handleOnOpenChangeAlert = (open: boolean) => {
    setOpenAlert(open);
  }

  const handleOnClick = (props: { id?: number, name?: string }) => {
    setOpen(!open);

    if (props.id) {
      form.setValue("id", String(props.id));
      form.setValue("name", props.name as string);
    }
  }

  const handleOnClickAlert = (id: number) => {
    setOpenAlert(!openAlert);
    setIdPropertyCategory(String(id));
  }

  useEffect(() => {
    if (session) dispatch(getPropertyCategoryThunk({token: session.user.accessToken!}));
  }, [session, dispatch]);
  return (
    <main className="min-h-svh pt-[78px] px-6 md:px-10 xl:px-20 ">
      <AlertDialogDelete
        alertDialodDescrip="This action cannot be undone. This will permanently delete property category from our servers."
        onOpenChange={handleOnOpenChangeAlert}
        open={openAlert}
        onDelete={onDelete}
      />
      <DialogCustomAdmin
        titleDialogContent={form.getValues("id") ? "Edit Property Category" : "Create New Property Category"}
        open={open}
        onOpenChange={handleOnOpenChange}
      >
        <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Name" type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button aria-label="Close" variant="destructive" className="max-md:mt-4 rounded-full">Cancel</Button>
                </DialogClose>
                <Button type="submit" className="max-md:mt-4 bg-gossamer-500 hover:bg-gossamer-500/90 rounded-full">Save</Button>
              </DialogFooter>
            </form>
          </Form>
      </DialogCustomAdmin>
      <div className="my-6 flex md:flex-row flex-col justify-between md:items-center">
        <h1 className="text-lg md:text-2xl font-bold text-slate-900">Property Category</h1>
        <Button
          className="bg-gossamer-500 hover:bg-gossamer-500/90 rounded-full"
          onClick={() => handleOnClick({})}
        >
          Create New
        </Button>
      </div>
      {isLoading ? (
        <div className="min-h-[calc(100svh-200px)] w-full flex justify-center items-center">
          <Loader2 size={50} className="animate-spin" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Number</TableHead>
              <TableHead>Property Category</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(propertyCategories) && (
              <>
                {propertyCategories.map((d, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{i+1}</TableCell>
                    <TableCell>{d.name}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        onClick={() => handleOnClick(d)}
                        className="flex gap-2 items-center rounded-full bg-yellow-500 focus:bg-yellow-300 hover:bg-yellow-300"
                      >
                        <SquarePen size={20} />
                        Edit
                      </Button>
                      <Button
                        className="flex gap-2 items-center rounded-full bg-red-500 focus:bg-red-300 hover:bg-red-300"
                        onClick={() => handleOnClickAlert(d.id)}
                      >
                        <Trash2 size={20} />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      )}
    </main>
  )
}

export default PropertyCategory
