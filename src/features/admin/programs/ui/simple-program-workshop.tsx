"use client";

import { useState } from "react";
import Link from "next/link";
import { useCurrentLocale, useI18n } from "locales/client";
import { ExerciseAttributeValueEnum, ProgramLevel } from "@prisma/client";


import { createProgramSimple } from "../actions/create-program-simple.action";
import { addWeekToProgram } from "../actions/add-week.action";
import { addSessionToWeek } from "../actions/add-session.action";

import { generateSlug } from "@/shared/lib/slug";

function duplicateI18nText(value: string) {
  const trimmed = value.trim();

  return {
    title: trimmed,
    titleEn: trimmed,
    titleEs: trimmed,
    titlePt: trimmed,
    titleRu: trimmed,
    titleZhCn: trimmed,
    description: trimmed,
    descriptionEn: trimmed,
    descriptionEs: trimmed,
    descriptionPt: trimmed,
    descriptionRu: trimmed,
    descriptionZhCn: trimmed,
  };
}

function buildSessionSlugs(sessionTitle: string) {
  const root = generateSlug(sessionTitle.trim()) || "session";

  return {
    slug: `${root}-fr`,
    slugEn: `${root}-en`,
    slugEs: `${root}-es`,
    slugPt: `${root}-pt`,
    slugRu: `${root}-ru`,
    slugZhCn: `${root}-zh`,
  };
}

export function SimpleProgramWorkshop() {
  const t = useI18n();
  const locale = useCurrentLocale();

  const [programTitle, setProgramTitle] = useState("");
  const [programDescription, setProgramDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [image, setImage] = useState("https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80");
  const [level, setLevel] = useState<ProgramLevel>(ProgramLevel.BEGINNER);
  const [type, setType] = useState<ExerciseAttributeValueEnum>(ExerciseAttributeValueEnum.STRENGTH);
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [sessionsPerWeek, setSessionsPerWeek] = useState(3);
  const [sessionDurationMin, setSessionDurationMin] = useState(30);
  const [isPremium, setIsPremium] = useState(true);

  const [programId, setProgramId] = useState<string | null>(null);
  const [weekId, setWeekId] = useState<string | null>(null);

  const [weekTitle, setWeekTitle] = useState("Week 1");
  const [weekDescription, setWeekDescription] = useState("");

  const [sessionTitle, setSessionTitle] = useState("Session 1");
  const [sessionDescription, setSessionDescription] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState(45);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const resetMessages = () => {
    setMessage(null);
    setError(null);
  };

  const handleCreateProgram = async () => {
    resetMessages();
    setBusy(true);

    try {
      const created = await createProgramSimple({
        title: programTitle,
        description: programDescription,
        category,
        image,
        level,
        type,
        durationWeeks,
        sessionsPerWeek,
        sessionDurationMin,
        isPremium,
      });

      setProgramId(created.id);
      setMessage(t("admin.quick_msg_program_created", { id: created.id }));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.quick_err_generic"));
    } finally {
      setBusy(false);
    }
  };

  const handleAddWeek = async () => {
    if (!programId) {
      setError(t("admin.quick_err_create_program_first"));
      return;
    }

    resetMessages();
    setBusy(true);

    try {
      const i18n = duplicateI18nText(weekTitle);
      const desc = duplicateI18nText(weekDescription || weekTitle);

      const week = await addWeekToProgram({
        programId,
        weekNumber: 1,
        title: i18n.title,
        titleEn: i18n.titleEn,
        titleEs: i18n.titleEs,
        titlePt: i18n.titlePt,
        titleRu: i18n.titleRu,
        titleZhCn: i18n.titleZhCn,
        description: desc.description,
        descriptionEn: desc.descriptionEn,
        descriptionEs: desc.descriptionEs,
        descriptionPt: desc.descriptionPt,
        descriptionRu: desc.descriptionRu,
        descriptionZhCn: desc.descriptionZhCn,
      });

      setWeekId(week.id);
      setMessage(t("admin.quick_msg_week_added"));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.quick_err_generic"));
    } finally {
      setBusy(false);
    }
  };

  const handleAddSession = async () => {
    if (!weekId) {
      setError(t("admin.quick_err_add_week_first"));
      return;
    }

    resetMessages();
    setBusy(true);

    try {
      const i18n = duplicateI18nText(sessionTitle);
      const desc = duplicateI18nText(sessionDescription || sessionTitle);
      const slugs = buildSessionSlugs(sessionTitle);

      await addSessionToWeek({
        weekId,
        sessionNumber: 1,
        title: i18n.title,
        titleEn: i18n.titleEn,
        titleEs: i18n.titleEs,
        titlePt: i18n.titlePt,
        titleRu: i18n.titleRu,
        titleZhCn: i18n.titleZhCn,
        slug: slugs.slug,
        slugEn: slugs.slugEn,
        slugEs: slugs.slugEs,
        slugPt: slugs.slugPt,
        slugRu: slugs.slugRu,
        slugZhCn: slugs.slugZhCn,
        description: desc.description,
        descriptionEn: desc.descriptionEn,
        descriptionEs: desc.descriptionEs,
        descriptionPt: desc.descriptionPt,
        descriptionRu: desc.descriptionRu,
        descriptionZhCn: desc.descriptionZhCn,
        equipment: [],
        estimatedMinutes,
        isPremium,
      });

      setMessage(t("admin.quick_msg_session_added"));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.quick_err_generic"));
    } finally {
      setBusy(false);
    }
  };

  const programsListHref = `/${locale}/admin/programs`;
  const editorHref = programId ? `/${locale}/admin/programs/${programId}/edit` : programsListHref;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("admin.quick_page_title")}</h1>
          <p className="text-sm text-base-content/70">{t("admin.quick_page_intro")}</p>
        </div>
        <div className="flex gap-2">
          <Link className="btn btn-ghost btn-sm" href={programsListHref}>
            {t("admin.quick_back_list")}
          </Link>
          {programId ? (
            <Link className="btn btn-primary btn-sm" href={editorHref}>
              {t("admin.quick_open_editor")}
            </Link>
          ) : null}
        </div>
      </div>

      {message ? <div className="alert alert-success text-sm">{message}</div> : null}
      {error ? <div className="alert alert-error text-sm">{error}</div> : null}

      <div className="card bg-base-100 shadow">
        <div className="card-body space-y-4">
          <h2 className="card-title text-lg">{t("admin.quick_step_program")}</h2>
          <label className="form-control w-full max-w-xl">
            <span className="label-text">{t("admin.quick_field_title")}</span>
            <input
              className="input input-bordered"
              onChange={(event) => setProgramTitle(event.target.value)}
              placeholder={t("admin.quick_placeholder_program_title")}
              value={programTitle}
            />
          </label>
          <label className="form-control w-full">
            <span className="label-text">{t("admin.quick_field_description")}</span>
            <textarea
              className="textarea textarea-bordered min-h-[100px]"
              onChange={(event) => setProgramDescription(event.target.value)}
              placeholder={t("admin.quick_placeholder_program_desc")}
              value={programDescription}
            />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="form-control w-full">
              <span className="label-text">{t("admin.quick_field_category")}</span>
              <input className="input input-bordered" onChange={(event) => setCategory(event.target.value)} value={category} />
            </label>
            <label className="form-control w-full">
              <span className="label-text">{t("admin.quick_field_image")}</span>
              <input className="input input-bordered" onChange={(event) => setImage(event.target.value)} value={image} />
            </label>
            <label className="form-control w-full">
              <span className="label-text">{t("admin.quick_field_level")}</span>
              <select className="select select-bordered" onChange={(event) => setLevel(event.target.value as ProgramLevel)} value={level}>
                {Object.values(ProgramLevel).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-control w-full">
              <span className="label-text">{t("admin.quick_field_type")}</span>
              <select
                className="select select-bordered"
                onChange={(event) => setType(event.target.value as ExerciseAttributeValueEnum)}
                value={type}
              >
                {[ExerciseAttributeValueEnum.STRENGTH, ExerciseAttributeValueEnum.CARDIO, ExerciseAttributeValueEnum.BODYWEIGHT].map(
                  (value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ),
                )}
              </select>
            </label>
            <label className="form-control w-full">
              <span className="label-text">{t("admin.quick_field_duration_weeks")}</span>
              <input
                className="input input-bordered"
                min={1}
                onChange={(event) => setDurationWeeks(Number(event.target.value))}
                type="number"
                value={durationWeeks}
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text">{t("admin.quick_field_sessions_per_week")}</span>
              <input
                className="input input-bordered"
                min={1}
                onChange={(event) => setSessionsPerWeek(Number(event.target.value))}
                type="number"
                value={sessionsPerWeek}
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text">{t("admin.quick_field_session_minutes")}</span>
              <input
                className="input input-bordered"
                min={5}
                onChange={(event) => setSessionDurationMin(Number(event.target.value))}
                type="number"
                value={sessionDurationMin}
              />
            </label>
            <label className="label cursor-pointer justify-start gap-3">
              <input checked={isPremium} className="checkbox" onChange={(event) => setIsPremium(event.target.checked)} type="checkbox" />
              <span className="label-text">{t("admin.quick_field_premium")}</span>
            </label>
          </div>
          <button className="btn btn-primary w-fit" disabled={busy || Boolean(programId)} onClick={handleCreateProgram} type="button">
            {programId ? t("admin.quick_btn_created") : busy ? t("admin.quick_btn_adding") : t("admin.quick_btn_create_program")}
          </button>
        </div>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body space-y-4">
          <h2 className="card-title text-lg">{t("admin.quick_step_week")}</h2>
          <label className="form-control w-full max-w-xl">
            <span className="label-text">{t("admin.quick_week_title_label")}</span>
            <input className="input input-bordered" onChange={(event) => setWeekTitle(event.target.value)} value={weekTitle} />
          </label>
          <label className="form-control w-full">
            <span className="label-text">{t("admin.quick_week_desc_label")}</span>
            <textarea className="textarea textarea-bordered" onChange={(event) => setWeekDescription(event.target.value)} value={weekDescription} />
          </label>
          <button className="btn btn-secondary w-fit" disabled={busy || !programId || Boolean(weekId)} onClick={handleAddWeek} type="button">
            {weekId ? t("admin.quick_btn_week_added") : busy ? t("admin.quick_btn_adding") : t("admin.quick_btn_add_week")}
          </button>
        </div>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body space-y-4">
          <h2 className="card-title text-lg">{t("admin.quick_step_session")}</h2>
          <label className="form-control w-full max-w-xl">
            <span className="label-text">{t("admin.quick_session_title_label")}</span>
            <input className="input input-bordered" onChange={(event) => setSessionTitle(event.target.value)} value={sessionTitle} />
          </label>
          <label className="form-control w-full">
            <span className="label-text">{t("admin.quick_session_desc_label")}</span>
            <textarea
              className="textarea textarea-bordered"
              onChange={(event) => setSessionDescription(event.target.value)}
              value={sessionDescription}
            />
          </label>
          <label className="form-control w-full max-w-xs">
            <span className="label-text">{t("admin.quick_session_minutes_label")}</span>
            <input
              className="input input-bordered"
              min={5}
              onChange={(event) => setEstimatedMinutes(Number(event.target.value))}
              type="number"
              value={estimatedMinutes}
            />
          </label>
          <button className="btn btn-accent w-fit" disabled={busy || !weekId} onClick={handleAddSession} type="button">
            {busy ? t("admin.quick_btn_adding") : t("admin.quick_btn_add_session")}
          </button>
        </div>
      </div>
    </div>
  );
}
