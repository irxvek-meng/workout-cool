import { ExerciseAttributeValueEnum } from "@prisma/client";

import type { useI18n } from "locales/client";

type Translate = ReturnType<typeof useI18n>;

const equipmentTranslationKey: Partial<Record<ExerciseAttributeValueEnum, string>> = {
  [ExerciseAttributeValueEnum.DUMBBELL]: "workout_builder.equipment.dumbbell.label",
  [ExerciseAttributeValueEnum.BARBELL]: "workout_builder.equipment.barbell.label",
  [ExerciseAttributeValueEnum.KETTLEBELLS]: "workout_builder.equipment.kettlebell.label",
  [ExerciseAttributeValueEnum.BANDS]: "workout_builder.equipment.band.label",
  [ExerciseAttributeValueEnum.BODY_ONLY]: "workout_builder.equipment.bodyweight.label",
  [ExerciseAttributeValueEnum.NONE]: "workout_builder.equipment.bodyweight.label",
  [ExerciseAttributeValueEnum.WEIGHT_PLATE]: "workout_builder.equipment.plate.label",
  [ExerciseAttributeValueEnum.PULLUP_BAR]: "workout_builder.equipment.pullup_bar.label",
  [ExerciseAttributeValueEnum.BENCH]: "workout_builder.equipment.bench.label",
};

export function formatPrimaryMuscle(t: Translate, value: string | null): string {
  if (!value) {
    return "";
  }

  const key = `workout_builder.muscles.${value.toLowerCase()}`;
  const label = t(key as keyof typeof t);

  if (label === key) {
    return value.replaceAll("_", " ").toLowerCase();
  }

  return label;
}

export function formatEquipmentList(t: Translate, values: ExerciseAttributeValueEnum[]): string {
  const labels = values.map((value) => {
    const mappedKey = equipmentTranslationKey[value];

    if (mappedKey) {
      const label = t(mappedKey as keyof typeof t);
      if (label === mappedKey) {
        return value.replaceAll("_", " ").toLowerCase();
      }
      return label;
    }

    return value.replaceAll("_", " ").toLowerCase();
  });

  return labels.join(" · ");
}
