"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { ProgramLevel, ExerciseAttributeValueEnum } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "locales/client";

import { ATTRIBUTE_VALUE_TRANSLATION_KEYS } from "@/shared/lib/attribute-value-translation";

import { createProgramFormSchema } from "../lib/program-builder-zod";
import { ADMIN_PROGRAM_EQUIPMENT_VALUES } from "../lib/admin-equipment-options";
import { createProgram } from "../actions/create-program.action";

type ProgramFormData = z.infer<ReturnType<typeof createProgramFormSchema>>;

interface CreateProgramFormProps {
  currentStep: number;
  onStepComplete: (step: number) => void;
  onSuccess: () => void;
  onCancel: () => void;
}

const PROGRAM_TYPE_VALUES: ExerciseAttributeValueEnum[] = [
  ExerciseAttributeValueEnum.STRENGTH,
  ExerciseAttributeValueEnum.CARDIO,
  ExerciseAttributeValueEnum.BODYWEIGHT,
  ExerciseAttributeValueEnum.STRETCHING,
  ExerciseAttributeValueEnum.CALISTHENIC,
];

export function CreateProgramForm({ currentStep, onStepComplete, onSuccess, onCancel }: CreateProgramFormProps) {
  const t = useI18n();
  const programSchema = useMemo(() => createProgramFormSchema(t as (key: string) => string), [t]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<ExerciseAttributeValueEnum[]>([]);
  const [activeTab, setActiveTab] = useState("fr");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProgramFormData>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      level: ProgramLevel.BEGINNER,
      type: ExerciseAttributeValueEnum.STRENGTH,
      durationWeeks: 4,
      sessionsPerWeek: 3,
      sessionDurationMin: 30,
      isPremium: true,
      equipment: [],
      coaches: [],
      title: "",
      titleEn: "",
      titleEs: "",
      titlePt: "",
      titleRu: "",
      titleZhCn: "",
      description: "",
      descriptionEn: "",
      descriptionEs: "",
      descriptionPt: "",
      descriptionRu: "",
      descriptionZhCn: "",
    },
  });

  const coaches = watch("coaches") || [];

  const addCoach = () => {
    const newCoaches = [...coaches, { name: "", image: "", order: coaches.length }];
    setValue("coaches", newCoaches);
  };

  const removeCoach = (index: number) => {
    const newCoaches = coaches.filter((_, i) => i !== index);
    setValue("coaches", newCoaches);
  };

  const toggleEquipment = (equipment: ExerciseAttributeValueEnum) => {
    const newEquipment = selectedEquipment.includes(equipment)
      ? selectedEquipment.filter((e) => e !== equipment)
      : [...selectedEquipment, equipment];

    setSelectedEquipment(newEquipment);
    setValue("equipment", newEquipment);
  };

  const onSubmit = async (data: ProgramFormData) => {
    if (currentStep < 3) {
      onStepComplete(currentStep);
      return;
    }

    setIsLoading(true);
    try {
      await createProgram(data);
      onSuccess();
    } catch (error) {
      console.error("Error creating program:", error);
      alert(t("admin.program_builder.err_create_program"));
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{t("admin.program_builder.create_form_step1_heading")}</h2>

        {/* Language Tabs */}
        <div className="tabs tabs-boxed mb-6">
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

        <div className="space-y-4">
          {/* French Fields */}
          {activeTab === "fr" && (
            <div className="space-y-4">
              <div className="form-control">
                <label className="label" htmlFor="title">
                  <span className="label-text">{t("admin.program_builder.label_title_fr")}</span>
                </label>
                <input className="input input-bordered" id="title" {...register("title")} />
                {errors.title && <div className="text-sm text-error mt-1">{errors.title.message}</div>}
              </div>
              <div className="form-control">
                <label className="label" htmlFor="description">
                  <span className="label-text">{t("admin.program_builder.label_description_fr")}</span>
                </label>
                <textarea className="textarea textarea-bordered h-24" id="description" {...register("description")} />
                {errors.description && <div className="text-sm text-error mt-1">{errors.description.message}</div>}
              </div>
            </div>
          )}

          {/* English Fields */}
          {activeTab === "en" && (
            <div className="space-y-4">
              <div className="form-control">
                <label className="label" htmlFor="titleEn">
                  <span className="label-text">{t("admin.program_builder.label_title_en")}</span>
                </label>
                <input className="input input-bordered" id="titleEn" {...register("titleEn")} />
                {errors.titleEn && <div className="text-sm text-error mt-1">{errors.titleEn.message}</div>}
              </div>
              <div className="form-control">
                <label className="label" htmlFor="descriptionEn">
                  <span className="label-text">{t("admin.program_builder.label_description_en")}</span>
                </label>
                <textarea className="textarea textarea-bordered h-24" id="descriptionEn" {...register("descriptionEn")} />
                {errors.descriptionEn && <div className="text-sm text-error mt-1">{errors.descriptionEn.message}</div>}
              </div>
            </div>
          )}

          {/* Spanish Fields */}
          {activeTab === "es" && (
            <div className="space-y-4">
              <div className="form-control">
                <label className="label" htmlFor="titleEs">
                  <span className="label-text">{t("admin.program_builder.label_title_es")}</span>
                </label>
                <input className="input input-bordered" id="titleEs" {...register("titleEs")} />
                {errors.titleEs && <div className="text-sm text-error mt-1">{errors.titleEs.message}</div>}
              </div>
              <div className="form-control">
                <label className="label" htmlFor="descriptionEs">
                  <span className="label-text">{t("admin.program_builder.label_description_es")}</span>
                </label>
                <textarea className="textarea textarea-bordered h-24" id="descriptionEs" {...register("descriptionEs")} />
                {errors.descriptionEs && <div className="text-sm text-error mt-1">{errors.descriptionEs.message}</div>}
              </div>
            </div>
          )}

          {/* Portuguese Fields */}
          {activeTab === "pt" && (
            <div className="space-y-4">
              <div className="form-control">
                <label className="label" htmlFor="titlePt">
                  <span className="label-text">{t("admin.program_builder.label_title_pt")}</span>
                </label>
                <input className="input input-bordered" id="titlePt" {...register("titlePt")} />
                {errors.titlePt && <div className="text-sm text-error mt-1">{errors.titlePt.message}</div>}
              </div>
              <div className="form-control">
                <label className="label" htmlFor="descriptionPt">
                  <span className="label-text">{t("admin.program_builder.label_description_pt")}</span>
                </label>
                <textarea className="textarea textarea-bordered h-24" id="descriptionPt" {...register("descriptionPt")} />
                {errors.descriptionPt && <div className="text-sm text-error mt-1">{errors.descriptionPt.message}</div>}
              </div>
            </div>
          )}

          {/* Russian Fields */}
          {activeTab === "ru" && (
            <div className="space-y-4">
              <div className="form-control">
                <label className="label" htmlFor="titleRu">
                  <span className="label-text">{t("admin.program_builder.label_title_ru")}</span>
                </label>
                <input className="input input-bordered" id="titleRu" {...register("titleRu")} />
                {errors.titleRu && <div className="text-sm text-error mt-1">{errors.titleRu.message}</div>}
              </div>
              <div className="form-control">
                <label className="label" htmlFor="descriptionRu">
                  <span className="label-text">{t("admin.program_builder.label_description_ru")}</span>
                </label>
                <textarea className="textarea textarea-bordered h-24" id="descriptionRu" {...register("descriptionRu")} />
                {errors.descriptionRu && <div className="text-sm text-error mt-1">{errors.descriptionRu.message}</div>}
              </div>
            </div>
          )}

          {/* Chinese Fields */}
          {activeTab === "zh" && (
            <div className="space-y-4">
              <div className="form-control">
                <label className="label" htmlFor="titleZhCn">
                  <span className="label-text">{t("admin.program_builder.label_title_zh")}</span>
                </label>
                <input className="input input-bordered" id="titleZhCn" {...register("titleZhCn")} />
                {errors.titleZhCn && <div className="text-sm text-error mt-1">{errors.titleZhCn.message}</div>}
              </div>
              <div className="form-control">
                <label className="label" htmlFor="descriptionZhCn">
                  <span className="label-text">{t("admin.program_builder.label_description_zh")}</span>
                </label>
                <textarea className="textarea textarea-bordered h-24" id="descriptionZhCn" {...register("descriptionZhCn")} />
                {errors.descriptionZhCn && <div className="text-sm text-error mt-1">{errors.descriptionZhCn.message}</div>}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label" htmlFor="category">
                <span className="label-text">{t("admin.program_builder.create_form_category")}</span>
              </label>
              <input className="input input-bordered" id="category" {...register("category")} placeholder={t("admin.program_builder.create_form_category_ph")} />
              {errors.category && <div className="text-sm text-error mt-1">{errors.category.message}</div>}
            </div>
            <div className="form-control">
              <label className="label" htmlFor="image">
                <span className="label-text">{t("admin.program_builder.create_form_image_url")}</span>
              </label>
              <input className="input input-bordered" id="image" {...register("image")} placeholder={t("admin.program_builder.create_form_image_ph")} />
              {errors.image && <div className="text-sm text-error mt-1">{errors.image.message}</div>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label" htmlFor="level">
                <span className="label-text">{t("admin.program_builder.create_form_level")}</span>
              </label>
              <select
                className="select select-bordered"
                defaultValue={ProgramLevel.BEGINNER}
                onChange={(e) => setValue("level", e.target.value as ProgramLevel)}
              >
                <option value={ProgramLevel.BEGINNER}>{t("admin.program_builder.level_beginner")}</option>
                <option value={ProgramLevel.INTERMEDIATE}>{t("admin.program_builder.level_intermediate")}</option>
                <option value={ProgramLevel.ADVANCED}>{t("admin.program_builder.level_advanced")}</option>
                <option value={ProgramLevel.EXPERT}>{t("admin.program_builder.level_expert")}</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label" htmlFor="type">
                <span className="label-text">{t("admin.program_builder.create_form_type")}</span>
              </label>
              <select
                className="select select-bordered"
                defaultValue={ExerciseAttributeValueEnum.STRENGTH}
                onChange={(e) => setValue("type", e.target.value as ExerciseAttributeValueEnum)}
              >
                {PROGRAM_TYPE_VALUES.map((value) => (
                  <option key={value} value={value}>
                    {t(ATTRIBUTE_VALUE_TRANSLATION_KEYS[value] as keyof typeof t)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{t("admin.program_builder.create_form_step2_heading")}</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label" htmlFor="durationWeeks">
                <span className="label-text">{t("admin.program_builder.create_form_duration_weeks")}</span>
              </label>
              <input
                className="input input-bordered"
                id="durationWeeks"
                min="1"
                type="number"
                {...register("durationWeeks", { valueAsNumber: true })}
              />
              {errors.durationWeeks && <div className="text-sm text-error mt-1">{errors.durationWeeks.message}</div>}
            </div>
            <div className="form-control">
              <label className="label" htmlFor="sessionsPerWeek">
                <span className="label-text">{t("admin.program_builder.create_form_sessions_per_week")}</span>
              </label>
              <input
                className="input input-bordered"
                id="sessionsPerWeek"
                min="1"
                type="number"
                {...register("sessionsPerWeek", { valueAsNumber: true })}
              />
              {errors.sessionsPerWeek && <div className="text-sm text-error mt-1">{errors.sessionsPerWeek.message}</div>}
            </div>
            <div className="form-control">
              <label className="label" htmlFor="sessionDurationMin">
                <span className="label-text">{t("admin.program_builder.create_form_session_minutes")}</span>
              </label>
              <input
                className="input input-bordered"
                id="sessionDurationMin"
                min="5"
                type="number"
                {...register("sessionDurationMin", { valueAsNumber: true })}
              />
              {errors.sessionDurationMin && <div className="text-sm text-error mt-1">{errors.sessionDurationMin.message}</div>}
            </div>
          </div>

          <div>
            <label className="label">
              <span className="label-text">{t("admin.program_builder.create_form_equipment")}</span>
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {ADMIN_PROGRAM_EQUIPMENT_VALUES.map((value) => (
                <div
                  className={`badge cursor-pointer ${selectedEquipment.includes(value) ? "badge-primary" : "badge-outline"}`}
                  key={value}
                  onClick={() => toggleEquipment(value)}
                >
                  {t(ATTRIBUTE_VALUE_TRANSLATION_KEYS[value] as keyof typeof t)}
                </div>
              ))}
            </div>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input
                className="toggle toggle-primary"
                defaultChecked={true}
                id="isPremium"
                onChange={(e) => setValue("isPremium", e.target.checked)}
                type="checkbox"
              />
              <span className="label-text">{t("admin.program_builder.create_form_premium_program")}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <h2 className="card-title">{t("admin.program_builder.create_form_step3_heading")}</h2>
          <button className="btn btn-sm btn-primary" onClick={addCoach} type="button">
            <Plus className="h-4 w-4 mr-1" />
            {t("admin.program_builder.common_add")}
          </button>
        </div>
        <div className="space-y-4">
          {coaches.length === 0 ? (
            <p className="text-base-content/60 text-center py-8">{t("admin.program_builder.create_form_coaches_empty")}</p>
          ) : (
            coaches.map((_, index) => (
              <div className="flex gap-4 items-end" key={index}>
                <div className="flex-1 form-control">
                  <label className="label" htmlFor={`coach-name-${index}`}>
                    <span className="label-text">{t("admin.program_builder.create_form_coach_name")}</span>
                  </label>
                  <input
                    className="input input-bordered"
                    id={`coach-name-${index}`}
                    {...register(`coaches.${index}.name`)}
                    placeholder={t("admin.program_builder.create_form_coach_name_ph")}
                  />
                </div>
                <div className="flex-1 form-control">
                  <label className="label" htmlFor={`coach-image-${index}`}>
                    <span className="label-text">{t("admin.program_builder.create_form_coach_image")}</span>
                  </label>
                  <input
                    className="input input-bordered"
                    id={`coach-image-${index}`}
                    {...register(`coaches.${index}.image`)}
                    placeholder={t("admin.program_builder.create_form_image_ph")}
                  />
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => removeCoach(index)} type="button">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}

      <div className="flex justify-between pt-6 border-t border-base-300">
        <button className="btn btn-outline" onClick={onCancel} type="button">
          {t("admin.program_builder.common_cancel")}
        </button>
        <button className="btn btn-primary" disabled={isLoading} type="submit">
          {currentStep === 3
            ? isLoading
              ? t("admin.program_builder.create_form_submit_creating")
              : t("admin.program_builder.create_form_submit_create")
            : t("admin.program_builder.common_next")}
        </button>
      </div>
    </form>
  );
}
