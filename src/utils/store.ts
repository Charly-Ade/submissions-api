import { randomUUID } from "crypto";

export interface Submission {
  id: string;
  name: string;
  email: string;
  message: string;
  attachmentUrl: string | null;
  createdAt: string;
}

// In-memory store. Swap for a real DB later; the interface stays the same.
const submissions = new Map<string, Submission>();

export const saveSubmission = (data: Omit<Submission, "id" | "createdAt">): Submission => {
  const submission: Submission = { id: randomUUID(), createdAt: new Date().toISOString(), ...data };
  submissions.set(submission.id, submission);
  return submission;
};

export const findSubmission = (id: string): Submission | undefined => submissions.get(id);
