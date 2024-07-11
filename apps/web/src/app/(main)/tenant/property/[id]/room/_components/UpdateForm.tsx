import React, { useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UpdateRoomSchema } from '@/schemas/room-schema';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
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
import { useRouter } from 'next/navigation';

const UpdateForm = ({
  form,
  onSubmit,
  imageUrl,
}: {
  form: UseFormReturn<z.infer<typeof UpdateRoomSchema>>;
  onSubmit: (values: z.infer<typeof UpdateRoomSchema>) => void;
  imageUrl?: string;
}) => {
  const router = useRouter();

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

  return (
    <>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type of Room</FormLabel>
                <FormControl>
                  <Input placeholder="Type" {...field} />
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about the room"
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
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Harga</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Give us the price"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="relative z-10 flex aspect-video h-40 max-h-40 w-fit max-w-fit items-center justify-center overflow-hidden rounded-xl border-[1px] border-dashed">
            {image ? (
              <Image
                className="object-cover"
                src={URL.createObjectURL(image)}
                fill
                sizes="100%"
                alt="preview"
              />
            ) : imageUrl ? (
              <Image
                className="object-cover"
                src={`http://localhost:8000/rooms/${imageUrl}`}
                fill
                sizes="100%"
                alt="preview"
              />
            ) : (
              <p>Empty</p>
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
          <div className="flex gap-3">
            <Button
              type="reset"
              variant={'ghost'}
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit">Update Room</Button>
          </div>
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
                    aspect={2 / 1}
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

export default UpdateForm;
