import { z } from "zod";
import { ExerciseAttributeValueEnum, ProgramLevel, WorkoutSetType, WorkoutSetUnit } from "@prisma/client";

type Translate = (key: string) => string;

export function createExerciseAddSchema(t: Translate) {
  return z.object({
    exerciseId: z.string().min(1, t("admin.program_builder.validation_select_exercise")),
    instructions: z.string().min(1, t("admin.program_builder.validation_instructions_fr")),
    instructionsEn: z.string().min(1, t("admin.program_builder.validation_instructions_en")),
    suggestedSets: z.array(
      z.object({
        setIndex: z.number(),
        types: z.array(z.nativeEnum(WorkoutSetType)),
        valuesInt: z.array(z.number()).optional(),
        valuesSec: z.array(z.number()).optional(),
        units: z.array(z.nativeEnum(WorkoutSetUnit)).optional(),
      }),
    ),
  });
}

export function createSessionFormSchema(t: Translate) {
  return z.object({
    title: z.string().min(1, t("admin.program_builder.validation_title_fr")),
    titleEn: z.string().min(1, t("admin.program_builder.validation_title_en")),
    titleEs: z.string().min(1, t("admin.program_builder.validation_title_es")),
    titlePt: z.string().min(1, t("admin.program_builder.validation_title_pt")),
    titleRu: z.string().min(1, t("admin.program_builder.validation_title_ru")),
    titleZhCn: z.string().min(1, t("admin.program_builder.validation_title_zh")),
    description: z.string().min(1, t("admin.program_builder.validation_description_fr")),
    descriptionEn: z.string().min(1, t("admin.program_builder.validation_description_en")),
    descriptionEs: z.string().min(1, t("admin.program_builder.validation_description_es")),
    descriptionPt: z.string().min(1, t("admin.program_builder.validation_description_pt")),
    descriptionRu: z.string().min(1, t("admin.program_builder.validation_description_ru")),
    descriptionZhCn: z.string().min(1, t("admin.program_builder.validation_description_zh")),
    estimatedMinutes: z.number().min(5, t("admin.program_builder.validation_minutes_min")),
    isPremium: z.boolean(),
    equipment: z.array(z.nativeEnum(ExerciseAttributeValueEnum)),
  });
}

export function createProgramFormSchema(t: Translate) {
  return z.object({
    title: z.string().min(1, t("admin.program_builder.validation_title_fr")),
    titleEn: z.string().min(1, t("admin.program_builder.validation_title_en")),
    titleEs: z.string().min(1, t("admin.program_builder.validation_title_es")),
    titlePt: z.string().min(1, t("admin.program_builder.validation_title_pt")),
    titleRu: z.string().min(1, t("admin.program_builder.validation_title_ru")),
    titleZhCn: z.string().min(1, t("admin.program_builder.validation_title_zh")),
    description: z.string().min(1, t("admin.program_builder.validation_description_fr")),
    descriptionEn: z.string().min(1, t("admin.program_builder.validation_description_en")),
    descriptionEs: z.string().min(1, t("admin.program_builder.validation_description_es")),
    descriptionPt: z.string().min(1, t("admin.program_builder.validation_description_pt")),
    descriptionRu: z.string().min(1, t("admin.program_builder.validation_description_ru")),
    descriptionZhCn: z.string().min(1, t("admin.program_builder.validation_description_zh")),
    category: z.string().min(1, t("admin.program_builder.validation_category")),
    image: z.string().url(t("admin.program_builder.validation_image_url")),
    level: z.nativeEnum(ProgramLevel),
    type: z.nativeEnum(ExerciseAttributeValueEnum),
    durationWeeks: z.number().min(1, t("admin.program_builder.validation_duration_weeks")),
    sessionsPerWeek: z.number().min(1, t("admin.program_builder.validation_sessions_per_week")),
    sessionDurationMin: z.number().min(5, t("admin.program_builder.validation_session_duration")),
    equipment: z.array(z.nativeEnum(ExerciseAttributeValueEnum)),
    isPremium: z.boolean(),
    coaches: z.array(
      z.object({
        name: z.string().min(1, t("admin.program_builder.validation_coach_name")),
        image: z.string().url(t("admin.program_builder.validation_coach_image")),
        order: z.number(),
      }),
    ),
  });
}
