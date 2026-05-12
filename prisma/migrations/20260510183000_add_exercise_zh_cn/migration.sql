-- AlterTable (idempotent: local DB may already have columns from a prior failed / renamed migration)
ALTER TABLE "exercises"
ADD COLUMN IF NOT EXISTS "nameZhCn" TEXT,
ADD COLUMN IF NOT EXISTS "descriptionZhCn" TEXT,
ADD COLUMN IF NOT EXISTS "introductionZhCn" TEXT,
ADD COLUMN IF NOT EXISTS "slugZhCn" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "exercises_slugZhCn_key" ON "exercises"("slugZhCn");
