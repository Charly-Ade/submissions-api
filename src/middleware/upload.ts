import multer from "multer";
import { AppError } from "../utils/AppError";

const ALLOWED = ["application/pdf", "image/png", "image/jpeg"];

export const upload = multer({
  storage: multer.memoryStorage(), // never writes to disk
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED.includes(file.mimetype)) {
      return cb(new AppError("Only PDF, PNG and JPEG files are allowed", 400));
    }
    cb(null, true);
  },
});
