"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Archive, ChevronDown } from "lucide-react";
import { ProgramVisibility } from "@prisma/client";
import { useI18n } from "locales/client";

import { updateProgramVisibility } from "../actions/update-program-visibility.action";

interface VisibilityBadgeProps {
  programId: string;
  currentVisibility: ProgramVisibility;
}

const visibilityIcons = {
  [ProgramVisibility.DRAFT]: EyeOff,
  [ProgramVisibility.PUBLISHED]: Eye,
  [ProgramVisibility.ARCHIVED]: Archive,
} as const;

const visibilityColors = {
  [ProgramVisibility.DRAFT]: "badge-warning",
  [ProgramVisibility.PUBLISHED]: "badge-success",
  [ProgramVisibility.ARCHIVED]: "badge-neutral",
} as const;

export function VisibilityBadge({ programId, currentVisibility }: VisibilityBadgeProps) {
  const t = useI18n();
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const visibilityLabels: Record<ProgramVisibility, string> = {
    [ProgramVisibility.DRAFT]: t("admin.program_builder.visibility_draft"),
    [ProgramVisibility.PUBLISHED]: t("admin.program_builder.visibility_published"),
    [ProgramVisibility.ARCHIVED]: t("admin.program_builder.visibility_archived"),
  };

  const config = {
    label: visibilityLabels[currentVisibility],
    icon: visibilityIcons[currentVisibility],
    color: visibilityColors[currentVisibility],
  };
  const Icon = config.icon;

  const handleVisibilityChange = async (newVisibility: ProgramVisibility) => {
    if (newVisibility === currentVisibility) {
      return;
    }

    setIsUpdating(true);
    try {
      await updateProgramVisibility(programId, newVisibility);
      router.refresh();
    } catch (error) {
      console.error("Error updating visibility:", error);
      alert(error instanceof Error ? error.message : t("admin.program_builder.err_visibility"));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="dropdown dropdown-end">
      <div className={`badge ${config.color} gap-1 cursor-pointer hover:opacity-80`} role="button" tabIndex={0}>
        <Icon className="w-3 h-3" />
        {config.label}
        <ChevronDown className="w-3 h-3" />
      </div>

      <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52" tabIndex={0}>
        {Object.entries(ProgramVisibility).map(([key, value]) => {
          const ItemIcon = visibilityIcons[value];
          const itemLabel = visibilityLabels[value];

          return (
            <li key={key}>
              <a
                className={`flex items-center gap-2 ${currentVisibility === value ? "active" : ""}`}
                onClick={() => handleVisibilityChange(value)}
              >
                {isUpdating ? <span className="loading loading-spinner loading-xs"></span> : <ItemIcon className="w-4 h-4" />}
                {itemLabel}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
