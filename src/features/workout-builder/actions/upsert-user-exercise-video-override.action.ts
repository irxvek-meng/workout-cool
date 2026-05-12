"use server";

import { prisma } from "@/shared/lib/prisma";
import { ActionError, authenticatedActionClient } from "@/shared/api/safe-actions";
import { extractBilibiliPlayerUrlFromPaste } from "@/shared/lib/bilibili";

import { exerciseBilibiliPasteSchema } from "../schema/exercise-bilibili-paste.schema";

export const upsertUserExerciseVideoOverrideAction = authenticatedActionClient
  .schema(exerciseBilibiliPasteSchema)
  .action(async ({ parsedInput, ctx }) => {
    const normalized = extractBilibiliPlayerUrlFromPaste(parsedInput.paste);
    if (!normalized) {
      throw new ActionError("Invalid Bilibili embed");
    }

    await prisma.userExerciseVideoOverride.upsert({
      where: {
        userId_exerciseId: {
          userId: ctx.user.id,
          exerciseId: parsedInput.exerciseId,
        },
      },
      create: {
        userId: ctx.user.id,
        exerciseId: parsedInput.exerciseId,
        fullVideoUrl: normalized,
      },
      update: {
        fullVideoUrl: normalized,
      },
    });

    return { fullVideoUrl: normalized };
  });
