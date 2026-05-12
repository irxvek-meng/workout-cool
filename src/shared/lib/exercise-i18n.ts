import type { Locale } from "locales/types";

export interface ExerciseNameFields {
  name: string;
  nameEn: string | null;
  nameZhCn?: string | null;
}

export interface ExerciseDescriptionFields {
  description: string | null | undefined;
  descriptionEn: string | null | undefined;
  descriptionZhCn?: string | null | undefined;
}

export interface ExerciseIntroductionFields {
  introduction: string | null | undefined;
  introductionEn: string | null | undefined;
  introductionZhCn?: string | null | undefined;
}

export function getExerciseName(exercise: ExerciseNameFields, locale: Locale): string {
  switch (locale) {
    case "fr":
      return exercise.name;
    case "zh-CN":
      return exercise.nameZhCn ?? exercise.nameEn ?? exercise.name;
    case "en":
    case "es":
    case "pt":
    case "ru":
      return exercise.nameEn ?? exercise.name;
    default:
      return exercise.nameEn ?? exercise.name;
  }
}

export function getExerciseDescription(exercise: ExerciseDescriptionFields, locale: Locale): string {
  const fr = exercise.description ?? "";
  switch (locale) {
    case "fr":
      return fr;
    case "zh-CN":
      return exercise.descriptionZhCn ?? exercise.descriptionEn ?? fr;
    case "en":
    case "es":
    case "pt":
    case "ru":
      return exercise.descriptionEn ?? fr;
    default:
      return exercise.descriptionEn ?? fr;
  }
}

export function getExerciseIntroduction(exercise: ExerciseIntroductionFields, locale: Locale): string {
  const fr = exercise.introduction ?? "";
  switch (locale) {
    case "fr":
      return fr;
    case "zh-CN":
      return exercise.introductionZhCn ?? exercise.introductionEn ?? fr;
    case "en":
    case "es":
    case "pt":
    case "ru":
      return exercise.introductionEn ?? fr;
    default:
      return exercise.introductionEn ?? fr;
  }
}
