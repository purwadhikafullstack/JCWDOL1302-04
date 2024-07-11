import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { join } from 'path';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

export const uploaderSingle = (filePrefix: string, folderName: string) => {
  const defaultDir = join(__dirname, '../../public');

  const storage = multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: DestinationCallback
    ) => {
      const destination = folderName ? defaultDir + folderName : defaultDir;
      cb(null, destination);
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: FileNameCallback
    ) => {
      const originalnameParts = file.originalname.split('.');
      const fileExtension = originalnameParts[originalnameParts.length - 1];
      const newFileName = filePrefix + Date.now() + "." + fileExtension;

      cb(null, newFileName);
    },
  });

  const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

    if (!ACCEPTED_IMAGE_TYPES.includes(file.mimetype)) {
      return cb(new Error('Only .jpg, .jpeg, .png and .gif formats are supported.'));
    }
    return cb(null, true);
  }

  return multer({ storage: storage, limits: { fileSize: 1000000 }, fileFilter });
};
