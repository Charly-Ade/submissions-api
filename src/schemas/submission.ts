import { z } from "zod";

export const createSubmissionSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
});

export const submissionIdParamSchema = z.object({
  id: z.string().uuid("id must be a valid UUID"),
});

export type CreateSubmissionBody = z.infer<typeof createSubmissionSchema>;
