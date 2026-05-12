"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";
import Link from "next/link";
import { ExternalLink, Search } from "lucide-react";
import { useI18n } from "locales/client";

import { formatEquipmentList, formatPrimaryMuscle } from "../lib/format-exercise-meta";
import { useExerciseLibrary } from "../hooks/use-exercise-library";

import type { Locale } from "locales/types";
import type { ExerciseLibraryMuscleGroup, ExerciseLibraryRow } from "../types/exercise-library.types";

import { cn } from "@/shared/lib/utils";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const muscleGroupValues = ["all", "chest", "back", "legs"] as const;

const accentStyles = [
  { frame: "bg-[#E5F1FF]", text: "text-[#007AFF]" },
  { frame: "bg-[#EAF9EE]", text: "text-[#34C759]" },
  { frame: "bg-[#FFF4E5]", text: "text-[#FF9500]" },
];

interface ExerciseLibraryPageProps {
  locale: Locale;
}

export function ExerciseLibraryPage({ locale }: ExerciseLibraryPageProps) {
  const t = useI18n();
  const [muscleGroup, setMuscleGroup] = useQueryState(
    "group",
    parseAsStringLiteral(muscleGroupValues).withDefault("all"),
  );
  const [rawQuery, setRawQuery] = useQueryState("q", parseAsString.withDefault(""));
  const deferredQuery = useDeferredValue(rawQuery.trim());

  const { data, isLoading, isFetching, error } = useExerciseLibrary({
    query: deferredQuery,
    muscleGroup: (muscleGroup ?? "all") as ExerciseLibraryMuscleGroup,
  });

  const [selected, setSelected] = useState<ExerciseLibraryRow | null>(null);

  const tabs = useMemo(
    () => [
      { id: "all" as const, label: t("exercise_library.tab_all") },
      { id: "chest" as const, label: t("exercise_library.tab_chest") },
      { id: "back" as const, label: t("exercise_library.tab_back") },
      { id: "legs" as const, label: t("exercise_library.tab_legs") },
    ],
    [t],
  );

  const resolveDisplayName = (row: ExerciseLibraryRow) => {
    if (locale === "zh-CN") {
      return row.nameZhCn ?? row.nameEn ?? row.name;
    }

    return row.nameEn ?? row.name;
  };

  const resolveSubtitle = (row: ExerciseLibraryRow) => {
    const muscleLabel = formatPrimaryMuscle(t, row.primaryMuscle);
    const equipmentLabel = formatEquipmentList(t, row.equipment);
    const parts = [muscleLabel, equipmentLabel].filter(Boolean);
    return parts.join(" · ");
  };

  return (
    <div className="mx-auto w-full max-w-md px-3 pb-28 pt-2 sm:px-4 sm:pt-4">
      <div className="rounded-[28px] border border-black/5 bg-[#F2F2F7] p-4 shadow-none dark:border-white/10 dark:bg-slate-900/40">
        <header className="mb-5 space-y-1">
          <h1 className="text-[28px] font-bold leading-tight tracking-tight text-black dark:text-white">
            {t("exercise_library.page_title")}
          </h1>
          <p className="text-[15px] text-[#8E8E93] dark:text-slate-400">{t("exercise_library.page_subtitle")}</p>
        </header>

        <div className="mb-4">
          <Input
            aria-label={t("exercise_library.search_placeholder")}
            className="h-11 rounded-xl border-0 bg-[#E5E5EA] text-[15px] text-black shadow-none placeholder:text-[#8E8E93] focus-visible:ring-1 focus-visible:ring-[#007AFF] dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
            iconLeft={<Search aria-hidden className="h-4 w-4 text-[#8E8E93]" />}
            onChange={(event) => {
              void setRawQuery(event.target.value);
            }}
            placeholder={t("exercise_library.search_placeholder")}
            type="search"
            value={rawQuery}
          />
        </div>

        <div className="-mx-1 mb-5 flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => {
            const isActive = muscleGroup === tab.id;

            return (
              <button
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition duration-200 ease-out",
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-[#E5E5EA] text-black hover:bg-[#d9d9dd] dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700",
                )}
                key={tab.id}
                onClick={() => {
                  void setMuscleGroup(tab.id);
                }}
                type="button"
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className={cn("space-y-3", isFetching && "opacity-70 transition-opacity")}>
          {isLoading && <p className="text-center text-sm text-[#8E8E93]">{t("exercise_library.loading")}</p>}
          {error && <p className="text-center text-sm text-red-500">{t("exercise_library.error")}</p>}
          {!isLoading && !error && data?.length === 0 && (
            <p className="text-center text-sm text-[#8E8E93]">{t("exercise_library.empty")}</p>
          )}
          {data?.map((row, index) => {
            const accent = accentStyles[index % accentStyles.length];
            const initial = resolveDisplayName(row).slice(0, 1).toUpperCase();

            return (
              <button
                className="flex w-full items-center gap-3 rounded-2xl bg-white p-3.5 text-left transition duration-200 ease-out hover:bg-white/90 active:scale-[0.99] dark:border dark:border-white/5 dark:bg-slate-900 dark:hover:bg-slate-900/80"
                key={row.id}
                onClick={() => setSelected(row)}
                type="button"
              >
                <div
                  className={cn(
                    "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-semibold",
                    accent.frame,
                    accent.text,
                  )}
                >
                  {initial}
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="truncate text-[17px] font-semibold text-black dark:text-white">{resolveDisplayName(row)}</p>
                  <p className="truncate text-[13px] text-[#8E8E93] dark:text-slate-400">{resolveSubtitle(row)}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null);
          }
        }}
        open={Boolean(selected)}
      >
        <DialogContent className="max-w-md rounded-2xl border border-black/5 bg-white dark:border-white/10 dark:bg-slate-950">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">{resolveDisplayName(selected)}</DialogTitle>
                <DialogDescription className="text-sm text-[#8E8E93] dark:text-slate-400">
                  {resolveSubtitle(selected)}
                </DialogDescription>
              </DialogHeader>
              {selected.description && (
                <p className="text-sm leading-relaxed text-black/80 dark:text-slate-200">{selected.description}</p>
              )}
              {selected.fullVideoUrl && (
                <Button asChild className="w-full rounded-xl bg-[#007AFF] text-white hover:bg-[#0066d6]" size="large">
                  <Link href={selected.fullVideoUrl} rel="noopener noreferrer" target="_blank">
                    <ExternalLink className="h-4 w-4" />
                    {t("exercise_library.detail_video")}
                  </Link>
                </Button>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
