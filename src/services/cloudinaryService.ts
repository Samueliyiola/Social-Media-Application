import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const uploadSingleImage = (fileBuffer: Buffer, folder = 'user_profiles'): Promise<{ url: string, public_id: string }> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error || !result) return reject(error);
      resolve({ url: result.secure_url, public_id: result.public_id });
    });

    Readable.from(fileBuffer).pipe(stream);
  });
};

export const uploadMultipleImages = async (
  files: Express.Multer.File[],
  folder = 'post_media'
): Promise<{ url: string; public_id: string }[]> => {
  const uploads = files.map(file => uploadSingleImage(file.buffer, folder));
  return Promise.all(uploads);
};


export const deleteImage = (publicId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error || result?.result !== 'ok') return reject(error || new Error('Failed to delete image'));
      resolve();
    });
  });
};


export const deleteImages = (publicIds: string[] | string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof publicIds === 'string') {
      // Single deletion
      cloudinary.uploader.destroy(publicIds, (error, result) => {
        if (error || result?.result !== 'ok') {
          return reject(error || new Error(`Failed to delete image: ${publicIds}`));
        }
        resolve();
      });
    } else if (Array.isArray(publicIds)) {
      // Bulk deletion
      cloudinary.api.delete_resources(publicIds, (error, result) => {
        if (error) return reject(error);
        
        const failed = publicIds.filter(id => result.deleted[id] !== 'deleted');
        if (failed.length > 0) {
          return reject(new Error(`Failed to delete image(s): ${failed.join(', ')}`));
        }

        resolve();
      });
    } else {
      reject(new Error('Invalid input: must be a string or array of strings'));
    }
  });
};


export const uploadBase64Images = async (
  base64Strings: string[],
  folder = 'post_media'
): Promise<{ url: string; public_id: string }[]> => {
  const uploads = base64Strings.map((base64) => {
    return new Promise<{ url: string; public_id: string }>((resolve, reject) => {
      cloudinary.uploader.upload(
        base64,
        { folder },
        (error, result) => {
          if (error || !result) return reject(error || new Error('Upload failed'));
          resolve({ url: result.secure_url, public_id: result.public_id });
        }
      );
    });
  });

  return Promise.all(uploads);
};



// // services/cloudinaryService.ts
// import cloudinary from '../config/cloudinary.js';

// export interface UploadResult {
//   url: string;
//   public_id: string;
// }

// export const uploadToCloudinary = async ( filePath: string, folder = 'uploads'): Promise<UploadResult> => {
//   try {
//     const result = await cloudinary.uploader.upload(filePath, {
//       folder,
//     });

//     return {
//       url: result.secure_url,
//       public_id: result.public_id,
//     };
//   } catch (error: any) {
//     throw new Error(`Cloudinary upload failed: ${error.message}`);
//   }
// };
