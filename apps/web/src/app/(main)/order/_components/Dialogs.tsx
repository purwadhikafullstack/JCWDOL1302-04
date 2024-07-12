import React, { ChangeEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  cancelBookingsClientThunk,
  updateBookingsClientThunk,
  uploadPaymentProofClientThunk,
} from '@/redux/slices/client/transaction-thunk';
import { Session } from 'next-auth';
import Cropper, { Area, Point } from 'react-easy-crop';
import { Slider } from '@/components/ui/slider';
import getCroppedImg from '../../profile/_utils/cropImage';
import { AvatarSchema } from '@/schemas/profile-schema';
import { useToast } from '@/components/ui/use-toast';

interface DialogProps {
  session?: Session | null;
  invoiceId: string;
  dispatch: any;
}

interface DialogLinkPaymentProps {
  isOpenDialog: boolean;
  handleIsDialogOpen: (open: boolean) => void;
  urlPayment: string;
}

const DialogCancelPayment = ({ session, invoiceId, dispatch }: DialogProps) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button className="w-full bg-red-600 text-white hover:bg-red-600/90">
        Cancel Payment
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader className="gap-4">
        <DialogTitle>Apakah Anda benar-benar yakin?</DialogTitle>
        <DialogDescription>
          Tindakan ini tidak bisa dibatalkan. Tindakan ini akan membatalkan
          order anda secara permanen.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost">Batal</Button>
        </DialogClose>
        <Button
          className="bg-gossamer-500 hover:bg-gossamer-500/90"
          onClick={() => {
            session &&
              dispatch(
                cancelBookingsClientThunk({
                  userId: session.user.id,
                  invoiceId,
                  token: session.user.accessToken!,
                }),
              );
          }}
        >
          Yakin
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const DialogAddPaymentProof = ({
  session,
  invoiceId,
  dispatch,
}: DialogProps) => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const { toast } = useToast();

  const [newPhoto, setNewPhoto] = useState('');
  // const [image, setImage] = useState<File | null | undefined>();
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
      // form.setValue('image', croppedImage);
      // setImage(croppedImage);

      session &&
        dispatch(
          uploadPaymentProofClientThunk({
            userId: session.user.id,
            invoiceId,
            image: croppedImage,
            token: session.user.accessToken!,
          }),
        );
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

  const showToast = (type: boolean, message: string) => {
    return toast({
      variant: type ? 'default' : 'destructive',
      title: message,
    });
  };

  const onChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    const validateImage = AvatarSchema.safeParse({ image: file });

    if (!validateImage.success) {
      event.target.value = '';

      return showToast(
        false,
        validateImage.error.flatten().fieldErrors.image?.[0] as string,
      );
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewPhoto(reader.result as string);
    };
    reader.readAsDataURL(file!);
  };

  return (
    <Dialog open={isOpenDialog} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button className="bg-gossamer-600 hover:bg-gossamer-600/90 w-full text-white">
          Upload Payment Proof
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="gap-4">
          <DialogTitle>Payment Proof</DialogTitle>
          <DialogDescription>
            Silakan unggah bukti pembayaran manual Anda ke nomor rekening{' '}
            <span className="font-bold text-black">1234567890</span> di{' '}
            <span className="font-bold text-black">Bank Dummy</span> atas nama{' '}
            <span className="font-bold text-black">StayCation</span>. Pastikan
            bukti pembayaran yang diunggah jelas dan mencantumkan informasi
            lengkap transaksi Anda. Terima kasih!
          </DialogDescription>
          <div>
            <input
              id="edit-avatar"
              name="avatar"
              type="file"
              accept=".png, .jpg, .jpeg"
              hidden
              onChange={onChangeFile}
            />
            <label htmlFor="edit-avatar" className="font-semibold underline">
              Select Photo
            </label>
          </div>
          <div className="relative">
            {newPhoto ? (
              <>
                <div className="relative aspect-video">
                  <Cropper
                    image={newPhoto}
                    crop={crop}
                    zoom={zoom}
                    aspect={1 / 2}
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
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Batal</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className="bg-gossamer-500 hover:bg-gossamer-500/90"
              onClick={handleCropImage}
            >
              Upload
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const DialogCheckPaymentStatus = ({
  session,
  invoiceId,
  dispatch,
}: DialogProps) => (
  <Button
    className="bg-gossamer-600 hover:bg-gossamer-600/90 w-full text-white"
    onClick={() => {
      session &&
        dispatch(
          updateBookingsClientThunk({
            userId: session.user.id,
            invoiceId,
            token: session.user.accessToken!,
          }),
        );
    }}
  >
    Check Payment Status
  </Button>
);

const DialogLinkPayment = ({
  isOpenDialog,
  handleIsDialogOpen,
  urlPayment,
}: DialogLinkPaymentProps) => (
  <Dialog open={isOpenDialog} onOpenChange={handleIsDialogOpen}>
    <DialogTrigger asChild>
      <Button className="bg-gossamer-600 hover:bg-gossamer-600/90 w-full text-white">
        Link Payment
      </Button>
    </DialogTrigger>
    <DialogContent onInteractOutside={(e) => e.preventDefault()}>
      <DialogHeader>
        <DialogTitle></DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <iframe className="h-[500px] w-full" src={urlPayment}></iframe>
    </DialogContent>
  </Dialog>
);

export {
  DialogCancelPayment,
  DialogCheckPaymentStatus,
  DialogLinkPayment,
  DialogAddPaymentProof,
};
