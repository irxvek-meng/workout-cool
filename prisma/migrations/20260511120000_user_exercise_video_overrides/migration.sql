-- CreateTable
CREATE TABLE "user_exercise_video_overrides" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "fullVideoUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_exercise_video_overrides_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_exercise_video_overrides_userId_exerciseId_key" ON "user_exercise_video_overrides"("userId", "exerciseId");

-- AddForeignKey
ALTER TABLE "user_exercise_video_overrides" ADD CONSTRAINT "user_exercise_video_overrides_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_exercise_video_overrides" ADD CONSTRAINT "user_exercise_video_overrides_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;
