import type { ExerciseAttributeValueEnum } from "@prisma/client";

export type ExerciseLibraryMuscleGroup = "all" | "chest" | "back" | "legs";

export interface ExerciseLibraryRow {
  id: string;
  name: string;
  nameEn: string | null;
  nameZhCn: string | null;
  description: string | null;
  fullVideoUrl: string | null;
  primaryMuscle: ExerciseAttributeValueEnum | null;
  equipment: ExerciseAttributeValueEnum[];
}
