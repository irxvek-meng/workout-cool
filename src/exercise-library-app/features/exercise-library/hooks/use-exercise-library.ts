"use client";

import { useQuery } from "@tanstack/react-query";

import { searchExercisesAction } from "../actions/search-exercises.action";

import type { ExerciseLibraryMuscleGroup } from "../types/exercise-library.types";

export interface UseExerciseLibraryOptions {
  query: string;
  muscleGroup: ExerciseLibraryMuscleGroup;
  limit?: number;
}

export function useExerciseLibrary(options: UseExerciseLibraryOptions) {
  const { query, muscleGroup, limit = 60 } = options;

  return useQuery({
    queryKey: ["exercise-library", query, muscleGroup, limit],
    queryFn: async () => {
      const result = await searchExercisesAction({ query, muscleGroup, limit });
      return result?.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}
