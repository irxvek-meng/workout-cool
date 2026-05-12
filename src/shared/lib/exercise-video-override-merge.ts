import { prisma } from "@/shared/lib/prisma";

/**
 * For each exercise, if the user has a personal `fullVideoUrl` override, replace `fullVideoUrl`
 * with the override; otherwise keep the system default (may be null).
 */
export async function mergeFullVideoUrlsForUser<T extends { id: string; fullVideoUrl: string | null }>(
  userId: string | null | undefined,
  exercises: T[]
): Promise<T[]> {
  if (!userId || exercises.length === 0) {
    return exercises;
  }

  const ids = [...new Set(exercises.map((e) => e.id))];
  const overrides = await prisma.userExerciseVideoOverride.findMany({
    where: { userId, exerciseId: { in: ids } },
    select: { exerciseId: true, fullVideoUrl: true },
  });

  if (overrides.length === 0) {
    return exercises;
  }

  const map = new Map(overrides.map((o) => [o.exerciseId, o.fullVideoUrl]));

  return exercises.map((ex) => {
    const override = map.get(ex.id);
    if (override != null && override.length > 0) {
      return { ...ex, fullVideoUrl: override };
    }
    return ex;
  });
}
