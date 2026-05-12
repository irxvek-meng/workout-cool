"use client";

import { z } from "zod";
import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { useI18n } from "locales/client";

import { addWeekToProgram } from "../actions/add-week.action";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const weekSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  titleEn: z.string().min(1, "Le titre en anglais est requis"),
  titleEs: z.string().min(1, "Le titre en espagnol est requis"),
  titlePt: z.string().min(1, "Le titre en portugais est requis"),
  titleRu: z.string().min(1, "Le titre en russe est requis"),
  titleZhCn: z.string().min(1, "Le titre en chinois est requis"),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionEs: z.string().optional(),
  descriptionPt: z.string().optional(),
  descriptionRu: z.string().optional(),
  descriptionZhCn: z.string().optional(),
});

type WeekFormData = z.infer<typeof weekSchema>;

interface AddWeekModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  programId: string;
  nextWeekNumber: number;
}

export function AddWeekModal({ open, onOpenChange, programId, nextWeekNumber }: AddWeekModalProps) {
  const t = useI18n();
  const emptyWeek = useMemo<WeekFormData>(
    () => ({
      title: t("admin.program_builder.default_week_title_fr", { n: nextWeekNumber }),
      titleEn: t("admin.program_builder.default_week_title_en", { n: nextWeekNumber }),
      titleEs: t("admin.program_builder.default_week_title_es", { n: nextWeekNumber }),
      titlePt: t("admin.program_builder.default_week_title_pt", { n: nextWeekNumber }),
      titleRu: t("admin.program_builder.default_week_title_ru", { n: nextWeekNumber }),
      titleZhCn: t("admin.program_builder.default_week_title_zh", { n: nextWeekNumber }),
      description: "",
      descriptionEn: "",
      descriptionEs: "",
      descriptionPt: "",
      descriptionRu: "",
      descriptionZhCn: "",
    }),
    [t, nextWeekNumber],
  );

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("fr");
  const [formData, setFormData] = useState<WeekFormData>(emptyWeek);

  useEffect(() => {
    if (open) {
      setFormData(emptyWeek);
    }
  }, [open, emptyWeek]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addWeekToProgram({
        programId,
        weekNumber: nextWeekNumber,
        ...formData,
      });

      onOpenChange(false);
      window.location.reload(); // Refresh to show new week
    } catch (error) {
      console.error("Error adding week:", error);
      alert(t("admin.program_builder.err_add_week"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setActiveTab("fr");
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="modal modal-open modal-middle !mt-0">
      <div className="modal-box max-w-4xl overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">{t("admin.program_builder.week_modal_add_title")}</h3>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={handleClose}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Language Tabs */}
            <div className="tabs tabs-boxed">
              <button className={`tab ${activeTab === "fr" ? "tab-active" : ""}`} onClick={() => setActiveTab("fr")} type="button">
                {t("admin.program_builder.tab_fr")}
              </button>
              <button className={`tab ${activeTab === "en" ? "tab-active" : ""}`} onClick={() => setActiveTab("en")} type="button">
                {t("admin.program_builder.tab_en")}
              </button>
              <button className={`tab ${activeTab === "es" ? "tab-active" : ""}`} onClick={() => setActiveTab("es")} type="button">
                {t("admin.program_builder.tab_es")}
              </button>
              <button className={`tab ${activeTab === "pt" ? "tab-active" : ""}`} onClick={() => setActiveTab("pt")} type="button">
                {t("admin.program_builder.tab_pt")}
              </button>
              <button className={`tab ${activeTab === "ru" ? "tab-active" : ""}`} onClick={() => setActiveTab("ru")} type="button">
                {t("admin.program_builder.tab_ru")}
              </button>
              <button className={`tab ${activeTab === "zh" ? "tab-active" : ""}`} onClick={() => setActiveTab("zh")} type="button">
                {t("admin.program_builder.tab_zh")}
              </button>
            </div>

            {/* French Fields */}
            {activeTab === "fr" && (
              <div className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">{t("admin.program_builder.label_title_fr")}</span>
                  </label>
                  <input
                    className="input input-bordered w-full"
                    disabled={isLoading}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder={t("admin.program_builder.default_week_title_fr", { n: nextWeekNumber })}
                    required
                    type="text"
                    value={formData.title}
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">{t("admin.program_builder.label_description_fr")}</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full h-24"
                    disabled={isLoading}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder={t("admin.program_builder.ph_week_desc_fr")}
                    value={formData.description}
                  />
                </div>
              </div>
            )}

            {/* English Fields */}
            {activeTab === "en" && (
              <div className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">{t("admin.program_builder.label_title_en")}</span>
                  </label>
                  <input
                    className="input input-bordered w-full"
                    disabled={isLoading}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    placeholder={t("admin.program_builder.default_week_title_en", { n: nextWeekNumber })}
                    required
                    type="text"
                    value={formData.titleEn}
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">{t("admin.program_builder.label_description_en")}</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full h-24"
                    disabled={isLoading}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    placeholder={t("admin.program_builder.ph_week_desc_en")}
                    value={formData.descriptionEn}
                  />
                </div>
              </div>
            )}

            {/* Spanish Fields */}
            {activeTab === "es" && (
              <div className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">{t("admin.program_builder.label_title_es")}</span>
                  </label>
                  <input
                    className="input input-bordered w-full"
                    disabled={isLoading}
                    onChange={(e) => setFormData({ ...formData, titleEs: e.target.value })}
                    placeholder={t("admin.program_builder.default_week_title_es", { n: nextWeekNumber })}
                    required
                    type="text"
                    value={formData.titleEs}
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">{t("admin.program_builder.label_description_es")}</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full h-24"
                    disabled={isLoading}
                    onChange={(e) => setFormData({ ...formData, descriptionEs: e.target.value })}
                    placeholder={t("admin.program_builder.ph_week_desc_es")}
                    value={formData.descriptionEs}
                  />
                </div>
              </div>
            )}

            {/* Portuguese Fields */}
            {activeTab === "pt" && (
              <div className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">{t("admin.program_builder.label_title_pt")}</span>
                  </label>
                  <input
                    className="input input-bordered w-full"
                    disabled={isLoading}
                    onChange={(e) => setFormData({ ...formData, titlePt: e.target.value })}
                    placeholder={t("admin.program_builder.default_week_title_pt", { n: nextWeekNumber })}
                    required
                    type="text"
                    value={formData.titlePt}
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">{t("admin.program_builder.label_description_pt")}</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full h-24"
                    disabled={isLoading}
                    onChange={(e) => setFormData({ ...formData, descriptionPt: e.target.value })}
                    placeholder={t("admin.program_builder.ph_week_desc_pt")}
                    value={formData.descriptionPt}
                  />
                </div>
              </div>
            )}

            {/* Russian Fields */}
            {activeTab === "ru" && (
              <div className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">{t("admin.program_builder.label_title_ru")}</span>
                  </label>
                  <input
                    className="input input-bordered w-full"
                    disabled={isLoading}
                    onChange={(e) => setFormData({ ...formData, titleRu: e.target.value })}
                    placeholder={t("admin.program_builder.default_week_title_ru", { n: nextWeekNumber })}
                    required
                    type="text"
                    value={formData.titleRu}
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">{t("admin.program_builder.label_description_ru")}</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full h-24"
                    disabled={isLoading}
                    onChange={(e) => setFormData({ ...formData, descriptionRu: e.target.value })}
                    placeholder={t("admin.program_builder.ph_week_desc_ru")}
                    value={formData.descriptionRu}
                  />
                </div>
              </div>
            )}

            {/* Chinese Fields */}
            {activeTab === "zh" && (
              <div className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">{t("admin.program_builder.label_title_zh")}</span>
                  </label>
                  <input
                    className="input input-bordered w-full"
                    disabled={isLoading}
                    onChange={(e) => setFormData({ ...formData, titleZhCn: e.target.value })}
                    placeholder={t("admin.program_builder.default_week_title_zh", { n: nextWeekNumber })}
                    required
                    type="text"
                    value={formData.titleZhCn}
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">{t("admin.program_builder.label_description_zh")}</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full h-24"
                    disabled={isLoading}
                    onChange={(e) => setFormData({ ...formData, descriptionZhCn: e.target.value })}
                    placeholder={t("admin.program_builder.ph_week_desc_zh")}
                    value={formData.descriptionZhCn}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="modal-action">
            <button className="btn btn-ghost" disabled={isLoading} onClick={handleClose} type="button">
              {t("admin.program_builder.common_cancel")}
            </button>
            <button className="btn btn-primary" disabled={isLoading} type="submit">
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  {t("admin.program_builder.week_submit_adding")}
                </>
              ) : (
                t("admin.program_builder.week_submit_add")
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
