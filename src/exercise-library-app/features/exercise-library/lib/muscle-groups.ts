import { ExerciseAttributeValueEnum } from "@prisma/client";

import type { ExerciseLibraryMuscleGroup } from "../types/exercise-library.types";

export function getPrimaryMuscleValuesForGroup(group: ExerciseLibraryMuscleGroup): ExerciseAttributeValueEnum[] {
  if (group === "all") {
    return [];
  }

  if (group === "chest") {
    return [ExerciseAttributeValueEnum.CHEST];
  }

  if (group === "back") {
    return [ExerciseAttributeValueEnum.BACK, ExerciseAttributeValueEnum.LATS, ExerciseAttributeValueEnum.TRAPS];
  }

  return [
    ExerciseAttributeValueEnum.QUADRICEPS,
    ExerciseAttributeValueEnum.HAMSTRINGS,
    ExerciseAttributeValueEnum.GLUTES,
    ExerciseAttributeValueEnum.CALVES,
    ExerciseAttributeValueEnum.ADDUCTORS,
    ExerciseAttributeValueEnum.ABDUCTORS,
    ExerciseAttributeValueEnum.HIP_FLEXOR,
  ];
}
