"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";
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
import { SessionWithExercises } from "../types/program.types";
import { updateSession } from "../actions/update-session.action";

type SessionFormData = z.infer<ReturnType<typeof createSessionFormSchema>>;

interface EditSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: SessionWithExercises;
}

export function EditSessionModal({ open, onOpenChange, session }: EditSessionModalProps) {
  const t = useI18n();
  const sessionSchema = useMemo(() => createSessionFormSchema(t as (key: string) => string), [t]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("fr");
  const [selectedEquipment, setSelectedEquipment] = useState<ExerciseAttributeValueEnum[]>(session.equipment);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      title: session.title,
      titleEn: session.titleEn,
      titleEs: session.titleEs,
      titlePt: session.titlePt,
      titleRu: session.titleRu,
      titleZhCn: session.titleZhCn,
      description: session.description,
      descriptionEn: session.descriptionEn,
      descriptionEs: session.descriptionEs,
      descriptionPt: session.descriptionPt,
      descriptionRu: session.descriptionRu,
      descriptionZhCn: session.descriptionZhCn,
      estimatedMinutes: session.estimatedMinutes,
      isPremium: session.isPremium,
      equipment: session.equipment,
    },
  });

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

      await updateSession({
        sessionId: session.id,
        ...data,
        ...slugs,
      });

      onOpenChange(false);
      window.location.reload(); // Refresh to show updated session
    } catch (error) {
      console.error("Error updating session:", error);
      alert(t("admin.program_builder.err_update_session"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedEquipment(session.equipment);
    setActiveTab("fr");
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={handleClose} open={open}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("admin.program_builder.session_modal_edit_title")}</DialogTitle>
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
                <Label htmlFor="edit-title">{t("admin.program_builder.label_title_fr")}</Label>
                <Input id="edit-title" {...register("title")} />
                {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <Label htmlFor="edit-description">{t("admin.program_builder.label_description_fr")}</Label>
                <Textarea id="edit-description" {...register("description")} rows={3} />
                {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
              </div>
            </div>
          )}

          {/* English Fields */}
          {activeTab === "en" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-titleEn">{t("admin.program_builder.label_title_en")}</Label>
                <Input id="edit-titleEn" {...register("titleEn")} />
                {errors.titleEn && <p className="text-sm text-red-500 mt-1">{errors.titleEn.message}</p>}
              </div>
              <div>
                <Label htmlFor="edit-descriptionEn">{t("admin.program_builder.label_description_en")}</Label>
                <Textarea id="edit-descriptionEn" {...register("descriptionEn")} rows={3} />
                {errors.descriptionEn && <p className="text-sm text-red-500 mt-1">{errors.descriptionEn.message}</p>}
              </div>
            </div>
          )}

          {/* Spanish Fields */}
          {activeTab === "es" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-titleEs">{t("admin.program_builder.label_title_es")}</Label>
                <Input id="edit-titleEs" {...register("titleEs")} />
                {errors.titleEs && <p className="text-sm text-red-500 mt-1">{errors.titleEs.message}</p>}
              </div>
              <div>
                <Label htmlFor="edit-descriptionEs">{t("admin.program_builder.label_description_es")}</Label>
                <Textarea id="edit-descriptionEs" {...register("descriptionEs")} rows={3} />
                {errors.descriptionEs && <p className="text-sm text-red-500 mt-1">{errors.descriptionEs.message}</p>}
              </div>
            </div>
          )}

          {/* Portuguese Fields */}
          {activeTab === "pt" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-titlePt">{t("admin.program_builder.label_title_pt")}</Label>
                <Input id="edit-titlePt" {...register("titlePt")} />
                {errors.titlePt && <p className="text-sm text-red-500 mt-1">{errors.titlePt.message}</p>}
              </div>
              <div>
                <Label htmlFor="edit-descriptionPt">{t("admin.program_builder.label_description_pt")}</Label>
                <Textarea id="edit-descriptionPt" {...register("descriptionPt")} rows={3} />
                {errors.descriptionPt && <p className="text-sm text-red-500 mt-1">{errors.descriptionPt.message}</p>}
              </div>
            </div>
          )}

          {/* Russian Fields */}
          {activeTab === "ru" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-titleRu">{t("admin.program_builder.label_title_ru")}</Label>
                <Input id="edit-titleRu" {...register("titleRu")} />
                {errors.titleRu && <p className="text-sm text-red-500 mt-1">{errors.titleRu.message}</p>}
              </div>
              <div>
                <Label htmlFor="edit-descriptionRu">{t("admin.program_builder.label_description_ru")}</Label>
                <Textarea id="edit-descriptionRu" {...register("descriptionRu")} rows={3} />
                {errors.descriptionRu && <p className="text-sm text-red-500 mt-1">{errors.descriptionRu.message}</p>}
              </div>
            </div>
          )}

          {/* Chinese Fields */}
          {activeTab === "zh" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-titleZhCn">{t("admin.program_builder.label_title_zh")}</Label>
                <Input id="edit-titleZhCn" {...register("titleZhCn")} />
                {errors.titleZhCn && <p className="text-sm text-red-500 mt-1">{errors.titleZhCn.message}</p>}
              </div>
              <div>
                <Label htmlFor="edit-descriptionZhCn">{t("admin.program_builder.label_description_zh")}</Label>
                <Textarea id="edit-descriptionZhCn" {...register("descriptionZhCn")} rows={3} />
                {errors.descriptionZhCn && <p className="text-sm text-red-500 mt-1">{errors.descriptionZhCn.message}</p>}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-estimatedMinutes">{t("admin.program_builder.session_estimated_minutes")}</Label>
              <Input id="edit-estimatedMinutes" min="5" type="number" {...register("estimatedMinutes", { valueAsNumber: true })} />
              {errors.estimatedMinutes && <p className="text-sm text-red-500 mt-1">{errors.estimatedMinutes.message}</p>}
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <Switch
                defaultChecked={session.isPremium}
                id="edit-isPremium"
                onCheckedChange={(checked) => setValue("isPremium", checked)}
              />
              <Label htmlFor="edit-isPremium">{t("admin.program_builder.session_premium_label")}</Label>
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
              {isLoading ? t("admin.program_builder.session_submit_updating") : t("admin.program_builder.session_submit_edit")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
