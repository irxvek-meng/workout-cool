"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Calendar, Clock, Users, ArrowLeft, Edit } from "lucide-react";
import { useI18n } from "locales/client";

import { ProgramWithFullDetails } from "../types/program.types";
import { WeekCard } from "./week-card";
import { VisibilityBadge } from "./visibility-badge";
import { EditProgramModal } from "./edit-program-modal";
import { AddWeekModal } from "./add-week-modal";

interface ProgramBuilderProps {
  program: ProgramWithFullDetails;
}

export function ProgramBuilder({ program }: ProgramBuilderProps) {
  const t = useI18n();
  const [isAddWeekModalOpen, setIsAddWeekModalOpen] = useState(false);
  const [isEditProgramModalOpen, setIsEditProgramModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link className="btn btn-ghost btn-sm" href="/admin/programs">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("admin.program_builder.program_builder_back")}
        </Link>
      </div>

      {/* Program Overview */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                <Image alt={program.title} className="object-cover" fill src={program.image} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold">{program.title}</h1>
                </div>
                <p className="text-base-content/60 mb-3">{program.description}</p>
                <div className="flex gap-2">
                  <VisibilityBadge currentVisibility={program.visibility} programId={program.id} />
                  <div className={`badge ${program.isPremium ? "badge-primary" : "badge-secondary"}`}>
                    {program.isPremium ? t("programs.premium") : t("programs.free")}
                  </div>
                  <div className="badge badge-outline">{program.level}</div>
                  <div className="badge badge-outline">{program.category}</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button className="btn btn-sm btn-ghost" onClick={() => setIsEditProgramModalOpen(true)} title={t("admin.program_builder.program_builder_edit_program")}>
                <Edit className="h-4 w-4" />
              </button>
              <div className="text-right">
                <div className="text-sm text-base-content/60">{t("admin.program_builder.program_builder_participants")}</div>
                <div className="text-2xl font-bold">{program.participantCount}</div>
              </div>
            </div>
          </div>
          <div className="divider"></div>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-base-content/60" />
              <span>{t("admin.program_builder.program_builder_stats_weeks", { n: program.durationWeeks })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-base-content/60" />
              <span>{t("admin.program_builder.program_builder_stats_min_per_session", { n: program.sessionDurationMin })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-base-content/60" />
              <span>{t("admin.program_builder.program_builder_stats_sessions_per_week", { n: program.sessionsPerWeek })}</span>
            </div>
            <div>
              <span className="text-base-content/60">{t("admin.program_builder.program_builder_equipment_prefix")} </span>
              <span>{program.equipment.join(", ") || t("admin.program_builder.program_builder_equipment_none")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Coaches Section */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{t("admin.program_builder.program_builder_coaches_title", { count: program.coaches.length })}</h3>
            <button className="btn btn-sm btn-primary" onClick={() => setIsEditProgramModalOpen(true)} title={t("admin.program_builder.program_builder_edit_coaches")}>
              <Edit className="h-4 w-4 mr-2" />
              {t("admin.program_builder.program_builder_edit_coaches")}
            </button>
          </div>

          {program.coaches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Users className="h-12 w-12 text-base-content/60 mb-4" />
              <h4 className="text-lg font-semibold mb-2">{t("admin.program_builder.program_builder_no_coach_title")}</h4>
              <p className="text-base-content/60 text-center max-w-md mb-4">{t("admin.program_builder.program_builder_no_coach_desc")}</p>
              <button className="btn btn-primary btn-sm" onClick={() => setIsEditProgramModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t("admin.program_builder.program_builder_add_coach")}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {program.coaches.map((coach) => (
                <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg" key={coach.id}>
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image alt={coach.name} className="object-cover" fill src={coach.image} />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium">{coach.name}</h5>
                    <span className="text-xs text-base-content/60">{t("admin.program_builder.program_builder_coach_order", { n: coach.order + 1 })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content Tabs */}
      <div className="space-y-6">
        <div className="space-y-6">
          {/* Add Week Button */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {t("admin.program_builder.program_builder_weeks_heading", { current: program.weeks.length, total: program.durationWeeks })}
            </h3>
            <button className="btn btn-primary" onClick={() => setIsAddWeekModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t("admin.program_builder.program_builder_add_week")}
            </button>
          </div>

          {/* Weeks List */}
          <div className="space-y-4">
            {program.weeks.length === 0 ? (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-base-content/60 mb-4" />
                  <h4 className="text-lg font-semibold mb-2">{t("admin.program_builder.program_builder_no_weeks_title")}</h4>
                  <p className="text-base-content/60 text-center max-w-md mb-4">{t("admin.program_builder.program_builder_no_weeks_desc")}</p>
                  <button className="btn btn-primary" onClick={() => setIsAddWeekModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t("admin.program_builder.program_builder_add_first_week")}
                  </button>
                </div>
              </div>
            ) : (
              program.weeks.map((week) => <WeekCard key={week.id} week={week} />)
            )}
          </div>
        </div>

        {/* Analytics Tab Content */}
        <div className="hidden" id="analytics-content">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">{t("admin.program_builder.program_builder_analytics_title")}</h2>
              <p className="text-base-content/60">{t("admin.program_builder.program_builder_analytics_placeholder")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Week Modal */}
      <AddWeekModal
        nextWeekNumber={program.weeks.length + 1}
        onOpenChange={setIsAddWeekModalOpen}
        open={isAddWeekModalOpen}
        programId={program.id}
      />

      {/* Edit Program Modal */}
      <EditProgramModal onOpenChange={setIsEditProgramModalOpen} open={isEditProgramModalOpen} program={program} />
    </div>
  );
}
