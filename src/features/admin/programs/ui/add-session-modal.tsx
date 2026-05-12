"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { ExerciseAttributeValueEnum } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "locales/client";

import { generateSlugsForAllLanguages } from "@/shared/lib/slug";
import { ATTRIBUTE_VALUE_TRANSLATION_KEYS } from "@/shared/lib/attribute-value-translation";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { createSessionFormSchema } from "../lib/program-builder-zod";
import { ADMIN_PROGRAM_EQUIPMENT_VALUES } from "../lib/admin-equipment-options";
import { addSessionToWeek } from "../actions/add-session.action";

type SessionFormData = z.infer<ReturnType<typeof createSessionFormSchema>>;

interface AddSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weekId: string;
  nextSessionNumber: number;
}

export function AddSessionModal({ open, onOpenChange, weekId, nextSessionNumber }: AddSessionModalProps) {
  const t = useI18n();
  const sessionSchema = useMemo(() => createSessionFormSchema(t as (key: string) => string), [t]);
  const defaultValues = useMemo(
    () => ({
      title: t("admin.program_builder.default_session_title_fr", { n: nextSessionNumber }),
      titleEn: t("admin.program_builder.default_session_title_en", { n: nextSessionNumber }),
      titleEs: t("admin.program_builder.default_session_title_es", { n: nextSessionNumber }),
      titlePt: t("admin.program_builder.default_session_title_pt", { n: nextSessionNumber }),
      titleRu: t("admin.program_builder.default_session_title_ru", { n: nextSessionNumber }),
      titleZhCn: t("admin.program_builder.default_session_title_zh", { n: nextSessionNumber }),
      description: t("admin.program_builder.default_session_desc_fr", { n: nextSessionNumber }),
      descriptionEn: t("admin.program_builder.default_session_desc_en", { n: nextSessionNumber }),
      descriptionEs: t("admin.program_builder.default_session_desc_es", { n: nextSessionNumber }),
      descriptionPt: t("admin.program_builder.default_session_desc_pt", { n: nextSessionNumber }),
      descriptionRu: t("admin.program_builder.default_session_desc_ru", { n: nextSessionNumber }),
      descriptionZhCn: t("admin.program_builder.default_session_desc_zh", { n: nextSessionNumber }),
      estimatedMinutes: 30,
      isPremium: true,
      equipment: [],
    }),
    [t, nextSessionNumber],
  );

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("fr");
  const [selectedEquipment, setSelectedEquipment] = useState<ExerciseAttributeValueEnum[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, defaultValues, reset]);

  const toggleEquipment = (equipment: ExerciseAttributeValueEnum) => {
    const newEquipment = selectedEquipment.includes(equipment)
      ? selectedEquipment.filter((e) => e !== equipment)
      : [...selectedEquipment, equipment];

    setSelectedEquipment(newEquipment);
    setValue("equipment", newEquipment);
  };

  const onSubmit = async (data: SessionFormData) => {
    setIsLoading(true);
    try {
      // Generate slugs from titles
      const slugs = generateSlugsForAllLanguages({
        title: data.title,
        titleEn: data.titleEn,
        titleEs: data.titleEs,
        titlePt: data.titlePt,
        titleRu: data.titleRu,
        titleZhCn: data.titleZhCn,
      });

      await addSessionToWeek({
        weekId,
        sessionNumber: nextSessionNumber,
        ...data,
        ...slugs,
      });

      reset();
      setSelectedEquipment([]);
      onOpenChange(false);
      window.location.reload(); // Refresh to show new session
    } catch (error) {
      console.error("Error adding session:", error);
      alert(t("admin.program_builder.err_add_session"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedEquipment([]);
    setActiveTab("fr");
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={handleClose} open={open}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("admin.program_builder.session_modal_add_title")}</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
                <Label htmlFor="title">{t("admin.program_builder.label_title_fr")}</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder={t("admin.program_builder.default_session_title_fr", { n: nextSessionNumber })}
                />
                {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <Label htmlFor="description">{t("admin.program_builder.label_description_fr")}</Label>
                <Textarea id="description" {...register("description")} placeholder={t("admin.program_builder.ph_session_desc_fr")} rows={3} />
                {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
              </div>
            </div>
          )}

          {/* English Fields */}
          {activeTab === "en" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="titleEn">{t("admin.program_builder.label_title_en")}</Label>
                <Input
                  id="titleEn"
                  {...register("titleEn")}
                  placeholder={t("admin.program_builder.default_session_title_en", { n: nextSessionNumber })}
                />
                {errors.titleEn && <p className="text-sm text-red-500 mt-1">{errors.titleEn.message}</p>}
              </div>
              <div>
                <Label htmlFor="descriptionEn">{t("admin.program_builder.label_description_en")}</Label>
                <Textarea id="descriptionEn" {...register("descriptionEn")} placeholder={t("admin.program_builder.ph_session_desc_en")} rows={3} />
                {errors.descriptionEn && <p className="text-sm text-red-500 mt-1">{errors.descriptionEn.message}</p>}
              </div>
            </div>
          )}

          {/* Spanish Fields */}
          {activeTab === "es" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="titleEs">{t("admin.program_builder.label_title_es")}</Label>
                <Input
                  id="titleEs"
                  {...register("titleEs")}
                  placeholder={t("admin.program_builder.default_session_title_es", { n: nextSessionNumber })}
                />
                {errors.titleEs && <p className="text-sm text-red-500 mt-1">{errors.titleEs.message}</p>}
              </div>
              <div>
                <Label htmlFor="descriptionEs">{t("admin.program_builder.label_description_es")}</Label>
                <Textarea id="descriptionEs" {...register("descriptionEs")} placeholder={t("admin.program_builder.ph_session_desc_es")} rows={3} />
                {errors.descriptionEs && <p className="text-sm text-red-500 mt-1">{errors.descriptionEs.message}</p>}
              </div>
            </div>
          )}

          {/* Portuguese Fields */}
          {activeTab === "pt" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="titlePt">{t("admin.program_builder.label_title_pt")}</Label>
                <Input
                  id="titlePt"
                  {...register("titlePt")}
                  placeholder={t("admin.program_builder.default_session_title_pt", { n: nextSessionNumber })}
                />
                {errors.titlePt && <p className="text-sm text-red-500 mt-1">{errors.titlePt.message}</p>}
              </div>
              <div>
                <Label htmlFor="descriptionPt">{t("admin.program_builder.label_description_pt")}</Label>
                <Textarea id="descriptionPt" {...register("descriptionPt")} placeholder={t("admin.program_builder.ph_session_desc_pt")} rows={3} />
                {errors.descriptionPt && <p className="text-sm text-red-500 mt-1">{errors.descriptionPt.message}</p>}
              </div>
            </div>
          )}

          {/* Russian Fields */}
          {activeTab === "ru" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="titleRu">{t("admin.program_builder.label_title_ru")}</Label>
                <Input
                  id="titleRu"
                  {...register("titleRu")}
                  placeholder={t("admin.program_builder.default_session_title_ru", { n: nextSessionNumber })}
                />
                {errors.titleRu && <p className="text-sm text-red-500 mt-1">{errors.titleRu.message}</p>}
              </div>
              <div>
                <Label htmlFor="descriptionRu">{t("admin.program_builder.label_description_ru")}</Label>
                <Textarea id="descriptionRu" {...register("descriptionRu")} placeholder={t("admin.program_builder.ph_session_desc_ru")} rows={3} />
                {errors.descriptionRu && <p className="text-sm text-red-500 mt-1">{errors.descriptionRu.message}</p>}
              </div>
            </div>
          )}

          {/* Chinese Fields */}
          {activeTab === "zh" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="titleZhCn">{t("admin.program_builder.label_title_zh")}</Label>
                <Input
                  id="titleZhCn"
                  {...register("titleZhCn")}
                  placeholder={t("admin.program_builder.default_session_title_zh", { n: nextSessionNumber })}
                />
                {errors.titleZhCn && <p className="text-sm text-red-500 mt-1">{errors.titleZhCn.message}</p>}
              </div>
              <div>
                <Label htmlFor="descriptionZhCn">{t("admin.program_builder.label_description_zh")}</Label>
                <Textarea id="descriptionZhCn" {...register("descriptionZhCn")} placeholder={t("admin.program_builder.ph_session_desc_zh")} rows={3} />
                {errors.descriptionZhCn && <p className="text-sm text-red-500 mt-1">{errors.descriptionZhCn.message}</p>}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="estimatedMinutes">{t("admin.program_builder.session_estimated_minutes")}</Label>
              <Input id="estimatedMinutes" min="5" type="number" {...register("estimatedMinutes", { valueAsNumber: true })} />
              {errors.estimatedMinutes && <p className="text-sm text-red-500 mt-1">{errors.estimatedMinutes.message}</p>}
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <Switch defaultChecked={true} id="isPremium" onCheckedChange={(checked) => setValue("isPremium", checked)} />
              <Label htmlFor="isPremium">{t("admin.program_builder.session_premium_label")}</Label>
            </div>
          </div>

          <div>
            <Label>{t("admin.program_builder.session_equipment_label")}</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {ADMIN_PROGRAM_EQUIPMENT_VALUES.map((value) => (
                <Badge
                  className="cursor-pointer"
                  key={value}
                  onClick={() => toggleEquipment(value)}
                  variant={selectedEquipment.includes(value) ? "default" : "outline"}
                >
                  {t(ATTRIBUTE_VALUE_TRANSLATION_KEYS[value] as keyof typeof t)}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button onClick={handleClose} type="button" variant="outline">
              {t("admin.program_builder.common_cancel")}
            </Button>
            <Button disabled={isLoading} type="submit">
              {isLoading ? t("admin.program_builder.session_submit_adding") : t("admin.program_builder.session_submit_add")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
