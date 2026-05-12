"use server";

import { ExerciseAttributeNameEnum, type Prisma } from "@prisma/client";

import { searchExercisesSchema } from "../schema/search-exercises.schema";
import { getPrimaryMuscleValuesForGroup } from "../lib/muscle-groups";

import type { ExerciseLibraryRow } from "../types/exercise-library.types";

import { serverAuth } from "@/entities/user/model/get-server-session-user";
import { prisma } from "@/shared/lib/prisma";
import { mergeFullVideoUrlsForUser } from "@/shared/lib/exercise-video-override-merge";
import { actionClient } from "@/shared/api/safe-actions";

function mapExerciseToRow(exercise: {
  id: string;
  name: string;
  nameEn: string | null;
  nameZhCn: string | null;
  description: string | null;
  fullVideoUrl: string | null;
  attributes: {
    attributeName: { name: ExerciseAttributeNameEnum };
    attributeValue: { value: ExerciseLibraryRow["primaryMuscle"] };
  }[];
}): ExerciseLibraryRow {
  let primaryMuscle: ExerciseLibraryRow["primaryMuscle"] = null;
  const equipment: ExerciseLibraryRow["equipment"] = [];

  for (const attribute of exercise.attributes) {
    if (attribute.attributeName.name === ExerciseAttributeNameEnum.PRIMARY_MUSCLE) {
      primaryMuscle = attribute.attributeValue.value;
    }

    if (attribute.attributeName.name === ExerciseAttributeNameEnum.EQUIPMENT) {
      const value = attribute.attributeValue.value;
      if (value && !equipment.includes(value)) {
        equipment.push(value);
      }
    }
  }

  return {
    id: exercise.id,
    name: exercise.name,
    nameEn: exercise.nameEn,
    nameZhCn: exercise.nameZhCn,
    description: exercise.description,
    fullVideoUrl: exercise.fullVideoUrl,
    primaryMuscle,
    equipment: equipment.slice(0, 4),
  };
}

export const searchExercisesAction = actionClient.schema(searchExercisesSchema).action(async ({ parsedInput }) => {
  const { query, muscleGroup, limit } = parsedInput;

  try {
    const [primaryMuscleAttributeName, equipmentAttributeName] = await Promise.all([
      prisma.exerciseAttributeName.findUnique({
        where: { name: ExerciseAttributeNameEnum.PRIMARY_MUSCLE },
      }),
      prisma.exerciseAttributeName.findUnique({
        where: { name: ExerciseAttributeNameEnum.EQUIPMENT },
      }),
    ]);

    if (!primaryMuscleAttributeName || !equipmentAttributeName) {
      throw new Error("Missing exercise attribute configuration");
    }

    const primaryNameId = primaryMuscleAttributeName.id;
    const equipmentNameId = equipmentAttributeName.id;
    const muscleValues = getPrimaryMuscleValuesForGroup(muscleGroup);

    const andClauses: Prisma.ExerciseWhereInput[] = [];

    if (muscleValues.length > 0) {
      andClauses.push({
        attributes: {
          some: {
            attributeNameId: primaryNameId,
            attributeValue: {
              value: {
                in: muscleValues,
              },
            },
          },
        },
      });
    }

    if (query.length > 0) {
      andClauses.push({
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { nameEn: { contains: query, mode: "insensitive" } },
          { nameZhCn: { contains: query, mode: "insensitive" } },
        ],
      });
    }

    const where: Prisma.ExerciseWhereInput = andClauses.length > 0 ? { AND: andClauses } : {};

    const exercises = await prisma.exercise.findMany({
      where,
      orderBy: { name: "asc" },
      take: limit,
      include: {
        attributes: {
          where: {
            attributeNameId: {
              in: [primaryNameId, equipmentNameId],
            },
          },
          include: {
            attributeName: true,
            attributeValue: true,
          },
        },
      },
    });

    const viewer = await serverAuth();
    const mergedExercises = await mergeFullVideoUrlsForUser(viewer?.id, exercises);

    const rows: ExerciseLibraryRow[] = mergedExercises.map((exercise) => mapExerciseToRow(exercise));

    return rows;
  } catch (error) {
    console.error("searchExercisesAction failed", error);
    throw new Error("Failed to load exercises");
  }
});
