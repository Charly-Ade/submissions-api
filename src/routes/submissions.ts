import { Router } from "express";
import { submissionLimiter } from "../middleware/rateLimiter";
import { upload } from "../middleware/upload";
import { validateBody, validateParams } from "../middleware/validate";
import { createSubmissionSchema, CreateSubmissionBody, submissionIdParamSchema } from "../schemas/submission";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadToCloudinary } from "../utils/cloudinary";
import { sendConfirmationEmail } from "../utils/email";
import { findSubmission, saveSubmission } from "../utils/store";

const router = Router();

router.post(
  "/",
  submissionLimiter,
  upload.single("attachment"), // parses multipart; text fields land in req.body
  validateBody(createSubmissionSchema),
  asyncHandler<{}, unknown, CreateSubmissionBody>(async (req, res) => {
    const { name, email, message } = req.body;
    const uploaded = req.file ? await uploadToCloudinary(req.file) : null;

    const submission = saveSubmission({ name, email, message, attachmentUrl: uploaded?.secure_url ?? null });

    // Fire-and-forget: a failed email is logged but never breaks the response.
    sendConfirmationEmail(email, name, message).catch((e) => console.error("Email failed:", e.message));

    res.status(201).json({ success: true, data: submission });
  })
);

router.get(
  "/:id",
  validateParams(submissionIdParamSchema),
  asyncHandler<{ id: string }>(async (req, res) => {
    const submission = findSubmission(req.params.id);
    if (!submission) throw new AppError("Submission not found", 404);
    res.json({ success: true, data: submission });
  })
);

export default router;
