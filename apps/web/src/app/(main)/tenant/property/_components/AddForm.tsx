import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm, UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PropertySchema } from '@/schemas/property-schema';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { getTenantPropertyCategoryThunk } from '@/redux/slices/tenant-thunk';
import * as z from 'zod';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogPortal,
  DialogTrigger,
} from '@/components/ui/dialog';
import Cropper, { Area, Point } from 'react-easy-crop';
import getCroppedImg from '@/app/(main)/profile/_utils/cropImage';
import { X } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const AddForm = ({
  form,
  onSubmit,
}: {
  form: UseFormReturn<z.infer<typeof PropertySchema>>;
  onSubmit: (values: z.infer<typeof PropertySchema>) => void;
}) => {
  const { data: session } = useSession();

  const dispatch = useAppDispatch();

  const { categories, isLoadingCategories } = useAppSelector(
    (state) => state.tenantReducer,
  );

  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const [newPhoto, setNewPhoto] = useState('');
  const [image, setImage] = useState<File | null | undefined>();
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  const [zoom, setZoom] = useState(1);

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropImage = async () => {
    const croppedImage = await getCroppedImg(newPhoto, croppedAreaPixels);

    if (croppedImage) {
      form.setValue('image', croppedImage);
      setImage(croppedImage);
    }
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setNewPhoto('');
      setZoom(1);
      setCrop({ x: 0, y: 0 });
      setCroppedAreaPixels({ width: 0, height: 0, x: 0, y: 0 });
    }
    setIsOpenDialog(open);
  };

  useEffect(() => {
    if (isLoadingCategories === true)
      dispatch(
        getTenantPropertyCategoryThunk({ token: session?.user.accessToken! }),
      );
  }, [isLoadingCategories]);

  return (
    <>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Properti</FormLabel>
                <FormControl>
                  <Input placeholder="Nama" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deskripsi Properti</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="propertyCategoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={(event) => {
                    field.onChange(event ? Number(event) : undefined);
                  }}
                  // onValueChange={field.onChange}
                  value={JSON.stringify(field.value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingCategories ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        {/* {JSON.stringify(categories)} */}
                        {categories
                          ? categories.map((data, index) => (
                              <SelectItem
                                key={`${data.id}-${index}`}
                                value={JSON.stringify(data.id)}
                              >
                                {data.name}
                              </SelectItem>
                            ))
                          : 'kosong'}
                      </>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lokasi</FormLabel>
                <FormControl>
                  <Input placeholder="Lokasi" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="relative flex aspect-video h-full max-h-40 w-fit max-w-fit items-center justify-center overflow-hidden rounded-xl border-[1px] border-dashed">
            {image ? (
              <Image
                className="object-cover"
                src={URL.createObjectURL(image)}
                fill
                sizes="100%"
                alt="preview"
              />
            ) : (
              <p>Image Empty</p>
            )}
          </div>
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNewPhoto(reader.result as string);
                        };
                        reader.readAsDataURL(file!);

                        setIsOpenDialog(true);
                      }

                      // field.onChange(file);
                    }}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Tambah Property</Button>
        </form>
      </Form>
      <Dialog open={isOpenDialog} onOpenChange={handleDialogChange}>
        <DialogPortal>
          <DialogClose asChild>
            <button className="IconButton" aria-label="Close">
              <X />
            </button>
          </DialogClose>
        </DialogPortal>
        <DialogContent>
          <div className="relative">
            {newPhoto ? (
              <>
                <div className="relative aspect-video">
                  <Cropper
                    image={newPhoto}
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 2}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                </div>
                <div className="mt-4 flex gap-4">
                  <p>Zoom</p>
                  <Slider
                    min={1}
                    max={3}
                    defaultValue={[zoom]}
                    step={0.1}
                    onValueChange={(value) => setZoom(value[0])}
                  />
                </div>
              </>
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-sm border-2 border-dashed border-gray-700">
                <p className="text-center">
                  A preview of your new photo will be included here.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={handleCropImage} aria-label="Close">
                Save changes
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddForm;
