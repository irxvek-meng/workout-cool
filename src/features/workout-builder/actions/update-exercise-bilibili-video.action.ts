"use server";

import { headers } from "next/headers";
import { UserRole } from "@prisma/client";

import { auth } from "@/features/auth/lib/better-auth";
import { prisma } from "@/shared/lib/prisma";
import { actionClient, ActionError } from "@/shared/api/safe-actions";
import { extractBilibiliPlayerUrlFromPaste } from "@/shared/lib/bilibili";

import { exerciseBilibiliPasteSchema } from "../schema/exercise-bilibili-paste.schema";

export const updateExerciseBilibiliVideoAction = actionClient.schema(exerciseBilibiliPasteSchema).action(async ({ parsedInput }) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id || session.user.role !== UserRole.admin) {
    throw new ActionError("Unauthorized");
  }

  const normalized = extractBilibiliPlayerUrlFromPaste(parsedInput.paste);
  if (!normalized) {
    throw new ActionError("Invalid Bilibili embed");
  }

  await prisma.exercise.update({
    where: { id: parsedInput.exerciseId },
    data: { fullVideoUrl: normalized },
  });

  return { fullVideoUrl: normalized };
});
