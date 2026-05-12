"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useI18n } from "locales/client";

import { updateWeek } from "../actions/update-week.action";

interface EditWeekModalProps {
  week: {
    id: string;
    weekNumber: number;
    title: string;
    titleEn: string;
    titleEs: string;
    titlePt: string;
    titleRu: string;
    titleZhCn: string;
    description: string;
    descriptionEn: string;
    descriptionEs: string;
    descriptionPt: string;
    descriptionRu: string;
    descriptionZhCn: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditWeekModal({ week, open, onOpenChange }: EditWeekModalProps) {
  const t = useI18n();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("fr");
  const [formData, setFormData] = useState({
    title: week.title,
    titleEn: week.titleEn,
    titleEs: week.titleEs,
    titlePt: week.titlePt,
    titleRu: week.titleRu,
    titleZhCn: week.titleZhCn,
    description: week.description,
    descriptionEn: week.descriptionEn,
    descriptionEs: week.descriptionEs,
    descriptionPt: week.descriptionPt,
    descriptionRu: week.descriptionRu,
    descriptionZhCn: week.descriptionZhCn,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setFormData({
      title: week.title,
      titleEn: week.titleEn,
      titleEs: week.titleEs,
      titlePt: week.titlePt,
      titleRu: week.titleRu,
      titleZhCn: week.titleZhCn,
      description: week.description,
      descriptionEn: week.descriptionEn,
      descriptionEs: week.descriptionEs,
      descriptionPt: week.descriptionPt,
      descriptionRu: week.descriptionRu,
      descriptionZhCn: week.descriptionZhCn,
    });
    setActiveTab("fr");
  }, [open, week.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateWeek(week.id, formData);
      setActiveTab("fr");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Error saving week:", error);
      alert(error instanceof Error ? error.message : t("admin.program_builder.err_save_week"));
    } finally {
      setIsSaving(false);
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
          <h3 className="font-bold text-lg">{t("admin.program_builder.week_modal_edit_title", { n: week.weekNumber })}</h3>
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
                    disabled={isSaving}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder={t("admin.program_builder.default_week_title_fr", { n: week.weekNumber })}
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
                    disabled={isSaving}
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
                    disabled={isSaving}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    placeholder={t("admin.program_builder.default_week_title_en", { n: week.weekNumber })}
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
                    disabled={isSaving}
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
                    disabled={isSaving}
                    onChange={(e) => setFormData({ ...formData, titleEs: e.target.value })}
                    placeholder={t("admin.program_builder.default_week_title_es", { n: week.weekNumber })}
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
                    disabled={isSaving}
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
                    disabled={isSaving}
                    onChange={(e) => setFormData({ ...formData, titlePt: e.target.value })}
                    placeholder={t("admin.program_builder.default_week_title_pt", { n: week.weekNumber })}
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
                    disabled={isSaving}
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
                    disabled={isSaving}
                    onChange={(e) => setFormData({ ...formData, titleRu: e.target.value })}
                    placeholder={t("admin.program_builder.default_week_title_ru", { n: week.weekNumber })}
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
                    disabled={isSaving}
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
                    disabled={isSaving}
                    onChange={(e) => setFormData({ ...formData, titleZhCn: e.target.value })}
                    placeholder={t("admin.program_builder.default_week_title_zh", { n: week.weekNumber })}
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
                    disabled={isSaving}
                    onChange={(e) => setFormData({ ...formData, descriptionZhCn: e.target.value })}
                    placeholder={t("admin.program_builder.ph_week_desc_zh")}
                    value={formData.descriptionZhCn}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="modal-action">
            <button className="btn btn-ghost" disabled={isSaving} onClick={handleClose} type="button">
              {t("admin.program_builder.common_cancel")}
            </button>
            <button className="btn btn-primary" disabled={isSaving} type="submit">
              {isSaving ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  {t("admin.program_builder.week_submit_saving")}
                </>
              ) : (
                t("admin.program_builder.week_submit_save")
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
