import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { env } from "../config/env";
import { AppError } from "./AppError";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

// Streams the in-memory buffer straight to Cloudinary (nothing touches disk).
export const uploadToCloudinary = (file: Express.Multer.File): Promise<UploadApiResponse> =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "submissions", resource_type: "auto" },
      (error, result) => {
        if (error || !result) return reject(new AppError("File upload failed", 502));
        resolve(result);
      }
    );
    stream.end(file.buffer);
  });
