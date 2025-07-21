/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Request } from 'express';

const baseUploadDirectory = '/fungura/files';

export const multerOptions = {
  storage: diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void,
    ) => {
      // Extract serviceType from request or another source
      const serviceType = req.body.serviceType || 'default'; // or however you determine the service type

      const uploadDirectory = join(baseUploadDirectory, serviceType);
      cb(null, uploadDirectory);
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void,
    ) => {
      const filename = Date.now() + extname(file.originalname);
      cb(null, filename);
    },
  }),
};
