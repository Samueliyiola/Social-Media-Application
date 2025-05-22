import multer from 'multer';

const storage = multer.memoryStorage();

export const uploadProfilePicture = multer({ storage }).single('profilePicture');

export const uploadPostImages = multer({ storage }).array('media', 4); // max 4 images



















// // middlewares/upload.ts
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';

// // Ensure temp_uploads directory exists
// const tempDir = 'temp_uploads';
// if (!fs.existsSync(tempDir)) {
//   fs.mkdirSync(tempDir);
// }

// const storage = multer.diskStorage({
//   destination: (_req, _file, cb) => {
//     cb(null, tempDir);
//   },
//   filename: (_req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const fileFilter = (
//   _req: Express.Request,
//   file: Express.Multer.File,
//   cb: multer.FileFilterCallback
// ) => {
//   const ext = path.extname(file.originalname).toLowerCase();
//   if (['.jpg', '.jpeg', '.png'].includes(ext)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only JPG, JPEG, and PNG files are allowed'));
//   }
// };

// const upload = multer({ storage, fileFilter });

// export default upload;
