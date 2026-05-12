import { z } from "zod";

export const exerciseLibraryMuscleGroupSchema = z.enum(["all", "chest", "back", "legs"]);

export const searchExercisesSchema = z.object({
  query: z.string().trim().max(120).optional().default(""),
  muscleGroup: exerciseLibraryMuscleGroupSchema.default("all"),
  limit: z.number().int().min(1).max(100).default(60),
});

export type SearchExercisesInput = z.infer<typeof searchExercisesSchema>;
