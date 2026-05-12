"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Trash2 } from "lucide-react";
import { useI18n } from "locales/client";
import { ProgramLevel, ExerciseAttributeValueEnum } from "@prisma/client";

import { ADMIN_PROGRAM_EQUIPMENT_VALUES } from "../lib/admin-equipment-options";
import { updateProgram } from "../actions/update-program.action";

import { ATTRIBUTE_VALUE_TRANSLATION_KEYS } from "@/shared/lib/attribute-value-translation";

const PROGRAM_TYPE_VALUES: ExerciseAttributeValueEnum[] = [
  ExerciseAttributeValueEnum.STRENGTH,
  ExerciseAttributeValueEnum.CARDIO,
  ExerciseAttributeValueEnum.BODYWEIGHT,
  ExerciseAttributeValueEnum.STRETCHING,
  ExerciseAttributeValueEnum.CALISTHENIC,
];

interface EditProgramModalProps {
  program: {
    id: string;
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
    category: string;
    image: string;
    level: ProgramLevel;
    type: ExerciseAttributeValueEnum;
    durationWeeks: number;
    sessionsPerWeek: number;
    sessionDurationMin: number;
    equipment: ExerciseAttributeValueEnum[];
    isPremium: boolean;
    coaches: Array<{
      id: string;
      name: string;
      image: string;
      order: number;
    }>;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProgramModal({ program, open, onOpenChange }: EditProgramModalProps) {
  const router = useRouter();
  const t = useI18n();
  const [activeTab, setActiveTab] = useState("fr");
  const [formData, setFormData] = useState({
    title: program.title,
    titleEn: program.titleEn,
    titleEs: program.titleEs,
    titlePt: program.titlePt,
    titleRu: program.titleRu,
    titleZhCn: program.titleZhCn,
    description: program.description,
    descriptionEn: program.descriptionEn,
    descriptionEs: program.descriptionEs,
    descriptionPt: program.descriptionPt,
    descriptionRu: program.descriptionRu,
    descriptionZhCn: program.descriptionZhCn,
    category: program.category,
    image: program.image,
    level: program.level,
    type: program.type,
    durationWeeks: program.durationWeeks,
    sessionsPerWeek: program.sessionsPerWeek,
    sessionDurationMin: program.sessionDurationMin,
    equipment: program.equipment,
    isPremium: program.isPremium,
    coaches: program.coaches,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setFormData({
      title: program.title,
      titleEn: program.titleEn,
      titleEs: program.titleEs,
      titlePt: program.titlePt,
      titleRu: program.titleRu,
      titleZhCn: program.titleZhCn,
      description: program.description,
      descriptionEn: program.descriptionEn,
      descriptionEs: program.descriptionEs,
      descriptionPt: program.descriptionPt,
      descriptionRu: program.descriptionRu,
      descriptionZhCn: program.descriptionZhCn,
      category: program.category,
      image: program.image,
      level: program.level,
      type: program.type,
      durationWeeks: program.durationWeeks,
      sessionsPerWeek: program.sessionsPerWeek,
      sessionDurationMin: program.sessionDurationMin,
      equipment: program.equipment,
      isPremium: program.isPremium,
      coaches: program.coaches,
    });
    setActiveTab("fr");
  }, [open, program.id]);

  const programTypeOptions = useMemo(() => {
    const base = [...PROGRAM_TYPE_VALUES];
    if (!base.includes(formData.type)) base.push(formData.type);
    return base;
  }, [formData.type]);

  const equipmentBadgeValues = useMemo(() => {
    const unique = new Set([...ADMIN_PROGRAM_EQUIPMENT_VALUES, ...formData.equipment]);
    return Array.from(unique);
  }, [formData.equipment]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProgram(program.id, formData);
      setActiveTab("fr");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Error saving program:", error);
      alert(error instanceof Error ? error.message : t("admin.program_builder.err_save_program"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setActiveTab("fr");
    onOpenChange(false);
  };

  const handleEquipmentChange = (equipment: ExerciseAttributeValueEnum) => {
    const newEquipment = formData.equipment.includes(equipment)
      ? formData.equipment.filter((e) => e !== equipment)
      : [...formData.equipment, equipment];
    setFormData({ ...formData, equipment: newEquipment });
  };

  const addCoach = () => {
    const newCoaches = [...formData.coaches, { id: `new-${Date.now()}`, name: "", image: "", order: formData.coaches.length }];
    setFormData({ ...formData, coaches: newCoaches });
  };

  const removeCoach = (index: number) => {
    const newCoaches = formData.coaches.filter((_, i) => i !== index);
    setFormData({ ...formData, coaches: newCoaches });
  };

  const updateCoach = (index: number, field: string, value: string) => {
    const newCoaches = [...formData.coaches];
    newCoaches[index] = { ...newCoaches[index], [field]: value };
    setFormData({ ...formData, coaches: newCoaches });
  };

  if (!open) return null;

  return (
    <div className="modal modal-open modal-middle !mt-0">
      <div className="modal-box max-w-4xl overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">{t("admin.program_builder.program_modal_edit_title")}</h3>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={handleClose}>
            <X className="h-4 w-4" />
          </button>
        </div>

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
                  value={formData.descriptionZhCn}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text">{t("admin.program_builder.create_form_category")}</span>
              </label>
              <input
                className="input input-bordered w-full"
                disabled={isSaving}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder={t("admin.program_builder.create_form_category_ph")}
                type="text"
                value={formData.category}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">{t("admin.program_builder.create_form_image_url")}</span>
              </label>
              <input
                className="input input-bordered w-full"
                disabled={isSaving}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder={t("admin.program_builder.create_form_image_ph")}
                type="url"
                value={formData.image}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text">{t("admin.program_builder.create_form_level")}</span>
              </label>
              <select
                className="select select-bordered w-full"
                disabled={isSaving}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as ProgramLevel })}
                value={formData.level}
              >
                <option value={ProgramLevel.BEGINNER}>{t("admin.program_builder.level_beginner")}</option>
                <option value={ProgramLevel.INTERMEDIATE}>{t("admin.program_builder.level_intermediate")}</option>
                <option value={ProgramLevel.ADVANCED}>{t("admin.program_builder.level_advanced")}</option>
                <option value={ProgramLevel.EXPERT}>{t("admin.program_builder.level_expert")}</option>
              </select>
            </div>
            <div>
              <label className="label">
                <span className="label-text">{t("admin.program_builder.create_form_type")}</span>
              </label>
              <select
                className="select select-bordered w-full"
                disabled={isSaving}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ExerciseAttributeValueEnum })}
                value={formData.type}
              >
                {programTypeOptions.map((value) => (
                  <option key={value} value={value}>
                    {t(ATTRIBUTE_VALUE_TRANSLATION_KEYS[value] as keyof typeof t)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">
                <span className="label-text">{t("admin.program_builder.create_form_duration_weeks")}</span>
              </label>
              <input
                className="input input-bordered w-full"
                disabled={isSaving}
                min={1}
                onChange={(e) => setFormData({ ...formData, durationWeeks: parseInt(e.target.value) || 0 })}
                type="number"
                value={formData.durationWeeks}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">{t("admin.program_builder.create_form_sessions_per_week")}</span>
              </label>
              <input
                className="input input-bordered w-full"
                disabled={isSaving}
                min={1}
                onChange={(e) => setFormData({ ...formData, sessionsPerWeek: parseInt(e.target.value) || 0 })}
                type="number"
                value={formData.sessionsPerWeek}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">{t("admin.program_builder.create_form_session_minutes")}</span>
              </label>
              <input
                className="input input-bordered w-full"
                disabled={isSaving}
                min={1}
                onChange={(e) => setFormData({ ...formData, sessionDurationMin: parseInt(e.target.value) || 0 })}
                type="number"
                value={formData.sessionDurationMin}
              />
            </div>
          </div>

          <div>
            <label className="label">
              <span className="label-text">{t("admin.program_builder.create_form_equipment")}</span>
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {equipmentBadgeValues.map((value) => (
                <div
                  className={`badge cursor-pointer ${formData.equipment.includes(value) ? "badge-primary" : "badge-outline"}`}
                  key={value}
                  onClick={() => !isSaving && handleEquipmentChange(value)}
                >
                  {t(ATTRIBUTE_VALUE_TRANSLATION_KEYS[value] as keyof typeof t)}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="label cursor-pointer justify-start gap-2">
              <input
                checked={formData.isPremium}
                className="checkbox"
                disabled={isSaving}
                onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                type="checkbox"
              />
              <span className="label-text">{t("admin.program_builder.create_form_premium_program")}</span>
            </label>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="label">
                <span className="label-text font-medium">{t("admin.program_builder.program_coaches_heading")}</span>
              </label>
              <button className="btn btn-sm btn-primary" disabled={isSaving} onClick={addCoach} type="button">
                <Plus className="h-4 w-4 mr-1" />
                {t("admin.program_builder.common_add")}
              </button>
            </div>
            <div className="space-y-4">
              {formData.coaches.length === 0 ? (
                <p className="text-base-content/60 text-center py-8">{t("admin.program_builder.create_form_coaches_empty")}</p>
              ) : (
                formData.coaches.map((coach, index) => (
                  <div className="flex gap-4 items-end" key={coach.id}>
                    <div className="flex-1 form-control">
                      <label className="label" htmlFor={`coach-name-${index}`}>
                        <span className="label-text">{t("admin.program_builder.create_form_coach_name")}</span>
                      </label>
                      <input
                        className="input input-bordered"
                        disabled={isSaving}
                        id={`coach-name-${index}`}
                        onChange={(e) => updateCoach(index, "name", e.target.value)}
                        placeholder={t("admin.program_builder.create_form_coach_name_ph")}
                        value={coach.name}
                      />
                    </div>
                    <div className="flex-1 form-control">
                      <label className="label" htmlFor={`coach-image-${index}`}>
                        <span className="label-text">{t("admin.program_builder.create_form_coach_image")}</span>
                      </label>
                      <input
                        className="input input-bordered"
                        disabled={isSaving}
                        id={`coach-image-${index}`}
                        onChange={(e) => updateCoach(index, "image", e.target.value)}
                        placeholder={t("admin.program_builder.create_form_image_ph")}
                        type="url"
                        value={coach.image}
                      />
                    </div>
                    <button className="btn btn-outline btn-sm" disabled={isSaving} onClick={() => removeCoach(index)} type="button">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" disabled={isSaving} onClick={handleClose}>
            {t("admin.program_builder.common_cancel")}
          </button>
          <button className="btn btn-primary" disabled={isSaving} onClick={handleSave}>
            {isSaving ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                {t("admin.program_builder.common_saving")}
              </>
            ) : (
              t("admin.program_builder.common_save")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
