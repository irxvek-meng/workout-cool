"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { ExerciseAttributeValueEnum, ProgramLevel, ProgramVisibility, UserRole } from "@prisma/client";

import { generateSlug } from "@/shared/lib/slug";
import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/features/auth/lib/better-auth";

export interface CreateProgramSimpleInput {
  title: string;
  description: string;
  category: string;
  image: string;
  level: ProgramLevel;
  type: ExerciseAttributeValueEnum;
  durationWeeks?: number;
  sessionsPerWeek?: number;
  sessionDurationMin?: number;
  isPremium?: boolean;
}

function buildLocalizedSlugs(baseTitle: string) {
  const root = generateSlug(baseTitle.trim()) || "program";

  return {
    slug: `${root}-fr`,
    slugEn: `${root}-en`,
    slugEs: `${root}-es`,
    slugPt: `${root}-pt`,
    slugRu: `${root}-ru`,
    slugZhCn: `${root}-zh`,
  };
}

export async function createProgramSimple(data: CreateProgramSimpleInput) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user?.role !== UserRole.admin) {
    throw new Error("Unauthorized");
  }

  const title = data.title.trim();
  const description = data.description.trim();

  if (!title || !description) {
    throw new Error("Le titre et la description sont requis");
  }

  const slugs = buildLocalizedSlugs(title);

  const existingProgram = await prisma.program.findFirst({
    where: {
      OR: [
        { slug: slugs.slug },
        { slugEn: slugs.slugEn },
        { slugEs: slugs.slugEs },
        { slugPt: slugs.slugPt },
        { slugRu: slugs.slugRu },
        { slugZhCn: slugs.slugZhCn },
      ],
    },
  });

  if (existingProgram) {
    throw new Error("Un programme avec un titre trop proche existe déjà — modifiez le titre");
  }

  const program = await prisma.program.create({
    data: {
      ...slugs,
      title,
      titleEn: title,
      titleEs: title,
      titlePt: title,
      titleRu: title,
      titleZhCn: title,
      description,
      descriptionEn: description,
      descriptionEs: description,
      descriptionPt: description,
      descriptionRu: description,
      descriptionZhCn: description,
      category: data.category.trim(),
      image: data.image.trim(),
      level: data.level,
      type: data.type,
      durationWeeks: data.durationWeeks ?? 4,
      sessionsPerWeek: data.sessionsPerWeek ?? 3,
      sessionDurationMin: data.sessionDurationMin ?? 30,
      equipment: [],
      isPremium: data.isPremium ?? true,
      visibility: ProgramVisibility.DRAFT,
    },
  });

  revalidatePath("/admin/programs");
  revalidatePath("/admin/programs/quick");

  return { id: program.id, title: program.title };
}
