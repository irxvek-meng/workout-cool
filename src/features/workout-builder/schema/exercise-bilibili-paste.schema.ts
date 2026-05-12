import { z } from "zod";

export const exerciseBilibiliPasteSchema = z.object({
  exerciseId: z.string().min(1),
  paste: z.string().min(1).max(50_000),
});

export type ExerciseBilibiliPasteInput = z.infer<typeof exerciseBilibiliPasteSchema>;
