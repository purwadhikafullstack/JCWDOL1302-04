import { Dialog, DialogClose, DialogContent, DialogFooter, DialogPortal, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { AvatarSchema } from "@/schemas/profile-schema";
import { X } from "lucide-react";
import { ChangeEvent, useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import getCroppedImg from "../_utils/cropImage";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import { useSession } from "next-auth/react";

const DialogUpdatePhoto = () => {
  const { data: session, update } = useSession();
  const { toast } = useToast();
  const [newPhoto, setNewPhoto] = useState("");
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState({width: 0, height: 0, x: 0, y: 0});
  const [zoom, setZoom] = useState(1);

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const handleCropImage  = async () => {
    try {
      const croppedImage = await getCroppedImg(
        newPhoto,
        croppedAreaPixels,
      )

      api.patch("users/change-image", { email: session?.user.email, image: croppedImage}, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((res) => {
          showToast(true, "Image update successful.");
          update({...session?.user, image: res.data.data.image});
        })
        .catch((e) => {
          showToast(false, e.response.data.message);
        })
    } catch (e) {
      showToast(false, e as string);
    }
  }

  const showToast = (type: boolean, message: string) => {
    return toast({
      variant: type ? "default" : "destructive",
      title: message
    });
  }

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setNewPhoto("");
      setZoom(1);
      setCrop({ x: 0, y: 0 });
      setCroppedAreaPixels({width: 0, height: 0, x: 0, y: 0});
    }
  }

  const onChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    const validateImage = AvatarSchema.safeParse({ image: file });

    if (!validateImage.success) {
      event.target.value = "";

      return showToast(false, validateImage.error.flatten().fieldErrors.image?.[0] as string);
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewPhoto(reader.result as string);
    }
    reader.readAsDataURL(file!);
  }

  return (
    <Dialog onOpenChange={handleDialogChange}>
      <DialogTrigger>
        <span className="underline font-semibold">Edit Photo</span>
      </DialogTrigger>
      <DialogPortal>
        <DialogClose asChild>
          <button className="IconButton" aria-label="Close">
            <X />
          </button>
        </DialogClose>
      </DialogPortal>
      <DialogContent>
        <div>
          <input
            id="edit-avatar"
            name="avatar"
            type="file"
            accept="images/*"
            hidden
            onChange={onChangeFile}
          />
          <label htmlFor="edit-avatar" className="underline font-semibold">Select Photo</label>
        </div>
        <div className="relative">
          {newPhoto ? (
            <>
              <div className="relative aspect-square">
                <Cropper
                  image={newPhoto}
                  crop={crop}
                  zoom={zoom}
                  aspect={4 / 4}
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
            <div className="aspect-square border-2 rounded-sm border-dashed border-gray-700 flex justify-center items-center">
              <p className="text-center">A preview of your new photo will be included here.</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleCropImage} aria-label="Close">Save changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogUpdatePhoto
