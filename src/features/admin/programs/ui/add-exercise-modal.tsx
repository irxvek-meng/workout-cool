"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, Search } from "lucide-react";
import { WorkoutSetType, WorkoutSetUnit } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "locales/client";

import { CreateSuggestedSetData, SUGGESTED_SET_TEMPLATES } from "@/features/programs/lib/suggested-sets-helpers";

import { createExerciseAddSchema } from "../lib/program-builder-zod";
import { ExerciseWithAttributes } from "../types/program.types";
import { addExerciseToSession, getExercises } from "../actions/add-exercise.action";

type ExerciseFormData = z.infer<ReturnType<typeof createExerciseAddSchema>>;

interface AddExerciseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string;
  nextOrder: number;
}

export function AddExerciseModal({ open, onOpenChange, sessionId, nextOrder }: AddExerciseModalProps) {
  const t = useI18n();
  const exerciseSchema = useMemo(() => createExerciseAddSchema(t as (key: string) => string), [t]);
  const [isLoading, setIsLoading] = useState(false);
  const [exercises, setExercises] = useState<ExerciseWithAttributes[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<ExerciseWithAttributes | null>(null);
  const [suggestedSets, setSuggestedSets] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      suggestedSets: [],
    },
  });

  // Load exercises
  useEffect(() => {
    if (open) {
      loadExercises();
    }
  }, [open, searchTerm]);

  const loadExercises = async () => {
    try {
      const data = await getExercises(searchTerm);
      setExercises(data);
    } catch (error) {
      console.error("Error loading exercises:", error);
    }
  };

  const selectExercise = (exercise: ExerciseWithAttributes) => {
    setSelectedExercise(exercise);
    setValue("exerciseId", exercise.id);

    // Set default suggested sets based on exercise type
    const defaultSets = SUGGESTED_SET_TEMPLATES.strengthTraining();
    setSuggestedSets(defaultSets);
    setValue("suggestedSets", defaultSets);
  };

  const addSet = () => {
    const newSet = {
      setIndex: suggestedSets.length,
      types: [WorkoutSetType.WEIGHT, WorkoutSetType.REPS],
      valuesInt: [20, 10],
      units: [WorkoutSetUnit.kg],
    };
    const newSets = [...suggestedSets, newSet];
    setSuggestedSets(newSets);
    setValue("suggestedSets", newSets);
  };

  const removeSet = (index: number) => {
    const newSets = suggestedSets.filter((_, i) => i !== index);
    // Reindex sets
    const reindexedSets = newSets.map((set, i) => ({ ...set, setIndex: i }));
    setSuggestedSets(reindexedSets);
    setValue("suggestedSets", reindexedSets);
  };

  const updateSet = (index: number, field: string, value: any) => {
    const newSets = [...suggestedSets];
    newSets[index] = { ...newSets[index], [field]: value };
    setSuggestedSets(newSets);
    setValue("suggestedSets", newSets);
  };

  const getTemplate = (template: string) => {
    let sets: CreateSuggestedSetData[] = [];
    switch (template) {
      case "strength":
        sets = SUGGESTED_SET_TEMPLATES.strengthTraining();
        break;
      case "bodyweight":
        sets = SUGGESTED_SET_TEMPLATES.bodyweight();
        break;
      case "timed":
        sets = SUGGESTED_SET_TEMPLATES.timed();
        break;
    }
    setSuggestedSets(sets);
    setValue("suggestedSets", sets);
  };

  const onSubmit = async (data: ExerciseFormData) => {
    setIsLoading(true);
    try {
      await addExerciseToSession({
        sessionId,
        exerciseId: data.exerciseId,
        order: nextOrder,
        instructions: data.instructions,
        instructionsEn: data.instructionsEn,
        suggestedSets: data.suggestedSets,
      });

      handleClose();
      window.location.reload(); // Refresh to show new exercise
    } catch (error) {
      console.error("Error adding exercise:", error);
      alert(t("admin.program_builder.err_add_exercise"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedExercise(null);
    setSuggestedSets([]);
    setSearchTerm("");
    onOpenChange(false);
  };

  const strengthTemplate = () => getTemplate("strength");
  const bodyweightTemplate = () => getTemplate("bodyweight");
  const timedTemplate = () => getTemplate("timed");

  return (
    <>
      {open && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-4xl h-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">{t("admin.program_builder.add_exercise_title")}</h3>
              <button className="btn btn-sm btn-circle btn-ghost" onClick={handleClose}>
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 h-full">
              {/* Exercise Selection */}
              {!selectedExercise && (
                <div className="card bg-base-100 h-full">
                  <div className="card-body">
                    <h2 className="card-title">{t("admin.program_builder.add_exercise_pick_title")}</h2>
                    <div className="space-y-4 h-full">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-base-content/60" />
                        <input
                          className="input input-bordered w-full pl-10"
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder={t("admin.program_builder.add_exercise_search_ph")}
                          value={searchTerm}
                        />
                      </div>

                      <div className="grid gap-2  overflow-y-auto">
                        {exercises.map((exercise) => (
                          <div
                            className="flex items-center justify-between p-3 border border-base-300 rounded-lg cursor-pointer hover:bg-base-200"
                            key={exercise.id}
                            onClick={() => selectExercise(exercise)}
                          >
                            <div>
                              <h4 className="font-medium">{exercise.name}</h4>
                              <p className="text-sm text-base-content/60">{[exercise.nameEn, exercise.nameZhCn].filter(Boolean).join(" · ")}</p>
                            </div>
                            <button className="btn btn-sm btn-primary">{t("admin.program_builder.add_exercise_select")}</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Selected Exercise & Configuration */}
              {selectedExercise && (
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  {/* Exercise Info */}
                  <div className="card bg-base-100 shadow-xl h-full">
                    <div className="card-body">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="card-title">{selectedExercise.name}</h2>
                          <p className="text-sm text-base-content/60">
                            {[selectedExercise.nameEn, selectedExercise.nameZhCn].filter(Boolean).join(" · ")}
                          </p>
                        </div>
                        <button className="btn btn-outline" onClick={() => setSelectedExercise(null)} type="button">
                          {t("admin.program_builder.common_change")}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body h-full">
                      <h2 className="card-title">{t("admin.program_builder.add_exercise_instructions_heading")}</h2>
                      <div className="space-y-4">
                        <div className="form-control">
                          <label className="label" htmlFor="instructions">
                            <span className="label-text">{t("admin.program_builder.add_exercise_instructions_fr")}</span>
                          </label>
                          <textarea
                            className="textarea textarea-bordered"
                            id="instructions"
                            {...register("instructions")}
                            placeholder={t("admin.program_builder.add_exercise_instructions_fr_ph")}
                            rows={3}
                          />
                          {errors.instructions && <div className="text-sm text-error mt-1">{errors.instructions.message}</div>}
                        </div>
                        <div className="form-control">
                          <label className="label" htmlFor="instructionsEn">
                            <span className="label-text">{t("admin.program_builder.add_exercise_instructions_en")}</span>
                          </label>
                          <textarea
                            className="textarea textarea-bordered"
                            id="instructionsEn"
                            {...register("instructionsEn")}
                            placeholder={t("admin.program_builder.add_exercise_instructions_en_ph")}
                            rows={3}
                          />
                          {errors.instructionsEn && <div className="text-sm text-error mt-1">{errors.instructionsEn.message}</div>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Suggested Sets */}
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="card-title">{t("admin.program_builder.add_exercise_suggested_sets")}</h2>
                        <div className="flex gap-2">
                          <button className="btn btn-sm btn-outline" onClick={strengthTemplate} type="button">
                            {t("admin.program_builder.add_exercise_tpl_strength")}
                          </button>
                          <button className="btn btn-sm btn-outline" onClick={bodyweightTemplate} type="button">
                            {t("admin.program_builder.add_exercise_tpl_bodyweight")}
                          </button>
                          <button className="btn btn-sm btn-outline" onClick={timedTemplate} type="button">
                            {t("admin.program_builder.add_exercise_tpl_timed")}
                          </button>
                          <button className="btn btn-sm btn-primary" onClick={addSet} type="button">
                            <Plus className="h-4 w-4 mr-1" />
                            {t("admin.program_builder.add_exercise_add_set")}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {suggestedSets.map((set, index) => (
                          <div className="flex items-center gap-3 p-3 border border-base-300 rounded-lg" key={index}>
                            <div className="w-8 h-8 bg-primary text-primary-content rounded-full flex items-center justify-center text-sm font-semibold">
                              {index + 1}
                            </div>
                            <div className="flex-1 grid grid-cols-5 gap-2">
                              <div className="form-control">
                                <label className="label">
                                  <span className="label-text text-xs">{t("admin.program_builder.add_exercise_type")}</span>
                                </label>
                                <select
                                  className="select select-bordered select-sm"
                                  onChange={(e) => {
                                    const type = e.target.value;
                                    if (type === WorkoutSetType.WEIGHT) {
                                      updateSet(index, "types", [WorkoutSetType.WEIGHT, WorkoutSetType.REPS]);
                                    } else {
                                      updateSet(index, "types", [type]);
                                    }
                                  }}
                                  value={set.types?.[0] || ""}
                                >
                                  <option value="">{t("admin.program_builder.add_exercise_type_select")}</option>
                                  <option value={WorkoutSetType.WEIGHT}>{t("admin.program_builder.add_exercise_type_weight_reps")}</option>
                                  <option value={WorkoutSetType.REPS}>{t("admin.program_builder.add_exercise_type_reps")}</option>
                                  <option value={WorkoutSetType.TIME}>{t("admin.program_builder.add_exercise_type_time")}</option>
                                  <option value={WorkoutSetType.BODYWEIGHT}>{t("admin.program_builder.add_exercise_type_bodyweight")}</option>
                                </select>
                              </div>
                              
                              {/* Poids field - only show if WEIGHT type is selected */}
                              {set.types?.includes(WorkoutSetType.WEIGHT) && (
                                <div className="form-control">
                                  <label className="label">
                                    <span className="label-text text-xs">{t("admin.program_builder.add_exercise_weight")}</span>
                                  </label>
                                  <input
                                    className="input input-bordered input-sm"
                                    onChange={(e) => {
                                      const weightValue = parseInt(e.target.value) || 0;
                                      const repsValue = set.valuesInt?.[1] || 10;
                                      updateSet(index, "valuesInt", [weightValue, repsValue]);
                                    }}
                                    placeholder={t("admin.program_builder.add_exercise_ph_kg")}
                                    type="number"
                                    value={set.valuesInt?.[0] || ""}
                                  />
                                </div>
                              )}
                              
                              {/* Reps field - show for WEIGHT and REPS types */}
                              {(set.types?.includes(WorkoutSetType.REPS) || set.types?.includes(WorkoutSetType.WEIGHT)) && (
                                <div className="form-control">
                                  <label className="label">
                                    <span className="label-text text-xs">{t("admin.program_builder.add_exercise_reps")}</span>
                                  </label>
                                  <input
                                    className="input input-bordered input-sm"
                                    onChange={(e) => {
                                      const repsValue = parseInt(e.target.value) || 0;
                                      if (set.types?.includes(WorkoutSetType.WEIGHT)) {
                                        const weightValue = set.valuesInt?.[0] || 20;
                                        updateSet(index, "valuesInt", [weightValue, repsValue]);
                                      } else {
                                        updateSet(index, "valuesInt", [repsValue]);
                                      }
                                    }}
                                    placeholder={t("admin.program_builder.add_exercise_ph_reps")}
                                    type="number"
                                    value={set.types?.includes(WorkoutSetType.WEIGHT) ? set.valuesInt?.[1] || "" : set.valuesInt?.[0] || ""}
                                  />
                                </div>
                              )}
                              
                              {/* Bodyweight field - only show if BODYWEIGHT type is selected */}
                              {set.types?.includes(WorkoutSetType.BODYWEIGHT) && (
                                <div className="form-control">
                                  <label className="label">
                                    <span className="label-text text-xs">{t("admin.program_builder.add_exercise_type_bodyweight")}</span>
                                  </label>
                                  <input
                                    className="input input-bordered input-sm"
                                    placeholder="✔"
                                    readOnly
                                    value="✔"
                                  />
                                </div>
                              )}
                              
                              {/* Time field - only show if TIME type is selected */}
                              {set.types?.includes(WorkoutSetType.TIME) && (
                                <div className="form-control">
                                  <label className="label">
                                    <span className="label-text text-xs">{t("admin.program_builder.add_exercise_time_sec")}</span>
                                  </label>
                                  <input
                                    className="input input-bordered input-sm"
                                    onChange={(e) => updateSet(index, "valuesSec", [parseInt(e.target.value) || 0])}
                                    placeholder={t("admin.program_builder.add_exercise_ph_seconds")}
                                    type="number"
                                    value={set.valuesSec?.[0] || ""}
                                  />
                                </div>
                              )}
                              
                              {/* Unit field - only show if WEIGHT type is selected */}
                              {set.types?.includes(WorkoutSetType.WEIGHT) && (
                                <div className="form-control">
                                  <label className="label">
                                    <span className="label-text text-xs">{t("admin.program_builder.add_exercise_unit")}</span>
                                  </label>
                                  <select
                                    className="select select-bordered select-sm"
                                    onChange={(e) => updateSet(index, "units", [e.target.value])}
                                    value={set.units?.[0] || ""}
                                  >
                                    <option value="">{t("admin.program_builder.add_exercise_type_select")}</option>
                                    <option value={WorkoutSetUnit.kg}>kg</option>
                                    <option value={WorkoutSetUnit.lbs}>lbs</option>
                                  </select>
                                </div>
                              )}
                            </div>
                            <button className="btn btn-sm btn-outline" onClick={() => removeSet(index)} type="button">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}

                        {suggestedSets.length === 0 && (
                          <div className="text-center py-8 border-2 border-dashed border-base-300 rounded-lg">
                            <p className="text-base-content/60 mb-3">{t("admin.program_builder.add_exercise_empty_sets")}</p>
                            <button className="btn btn-sm btn-primary" onClick={addSet} type="button">
                              <Plus className="h-4 w-4 mr-1" />
                              {t("admin.program_builder.add_exercise_add_first_set")}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <button className="btn btn-outline" onClick={handleClose} type="button">
                      {t("admin.program_builder.common_cancel")}
                    </button>
                    <button className="btn btn-primary" disabled={isLoading} type="submit">
                      {isLoading ? t("admin.program_builder.add_exercise_submitting") : t("admin.program_builder.add_exercise_submit")}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
