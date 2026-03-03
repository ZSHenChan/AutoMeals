"use client";

import { useEffect, useMemo, useState } from "react";
import { Flame, ChevronDown, Settings2 } from "lucide-react";
import {
  SKILL_LEVELS,
  GOALS,
  MEAL_TYPES,
  EQUIPMENT,
  DEFAULT_USER_ID,
} from "@/lib/config";
import { H2, H3, PrimarySubH } from "./typography/heading";
import { Button } from "./button/clickable";
import { usePreferencesContext } from "@/app/context/preferences-context";
import type { UserPreferences } from "@/types/preferences";

interface UserProfileSelectorProps {
  onContextUpdate: (contextString: string) => void;
}

export function UserProfileSelector({ onContextUpdate }: UserProfileSelectorProps) {
  const [isOpen, setIsOpen] = useState(true);

  const {
    userId,
    isReady,
    setIsReady,
    hydratePreferences,
    cookingSkill,
    equipments,
    setCookingSkill,
    setEquipments,
  } = usePreferencesContext();

  const [goal, setGoal] = useState(GOALS[0]);
  const [mealType, setMealType] = useState(MEAL_TYPES[0]);
  const [additionalRequirement, setAdditionalRequirement] = useState<string>("");

  const toggleEquipment = (item: string) => {
    if (equipments.includes(item)) {
      setEquipments(equipments.filter((i) => i !== item));
    } else {
      setEquipments([...equipments, item]);
    }
  };

  const currentSkillLabel = SKILL_LEVELS.find((s) => s.id === cookingSkill)?.label;
  const profileContext = useMemo(
    () =>
      `
      - Cooking Skill: ${currentSkillLabel || cookingSkill}
      - Meal Type: ${mealType}
      - Dietary Goal: ${goal}
      - Available Equipment: ${equipments.join(", ") || "None"}
      - Additional Requirement: ${additionalRequirement}
    `.trim(),
    [currentSkillLabel, cookingSkill, mealType, goal, equipments, additionalRequirement],
  );

  useEffect(() => {
    onContextUpdate(profileContext);
  }, [profileContext, onContextUpdate]);

  useEffect(() => {
    if (isReady) {
      return;
    }

    if (userId === DEFAULT_USER_ID) {
      setIsReady(true);
      return;
    }

    const loadPreferences = async () => {
      try {
        // This endpoint uses getUserPreferences() in lib/redis.ts.
        const response = await fetch(`/api/preferences?userId=${userId}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load preferences");
        }

        const payload = (await response.json()) as {
          preferences: UserPreferences;
        };
        hydratePreferences(payload.preferences);
      } catch (error) {
        console.error(error);
      } finally {
        setIsReady(true);
      }
    };

    loadPreferences();
  }, [userId, isReady, setIsReady, hydratePreferences]);

  const equipmentSummary =
    equipments.length === 0
      ? ""
      : equipments.length === 1
        ? ` • ${equipments[0]}`
        : ` • ${equipments.length} Equipments`;

  if (!isReady) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 text-sm text-slate-500">
        Loading your saved preferences...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-6 hover:bg-gray-50/50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 text-orange-600 p-2 rounded-full">
              <Settings2 className="w-5 h-5" />
            </div>
            <div>
              <H3>Preferences</H3>
              <PrimarySubH>
                {currentSkillLabel} • {goal} • {mealType}
                {equipmentSummary}
              </PrimarySubH>
            </div>
          </div>

          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="p-6 pt-0 border-t border-gray-100 animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="space-y-6 mt-6">
              <div>
                <H2 className="mb-3 flex items-center gap-2">
                  <Flame className="w-4 h-4" /> Cooking Skill
                </H2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {SKILL_LEVELS.map((level) => (
                    <Button
                      key={level.id}
                      onClick={() => setCookingSkill(level.id)}
                      className={`text-left ${
                        cookingSkill === level.id && "border-orange-500 bg-orange-50 text-orange-700"
                      }`}
                    >
                      <div className="font-semibold text-sm">{level.label}</div>
                      <PrimarySubH className="font-medium">{level.desc}</PrimarySubH>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <H2>Today&apos;s Goal</H2>
                <div className="flex flex-wrap gap-2">
                  {GOALS.map((g) => (
                    <Button
                      key={g}
                      variant="secondary"
                      size="sm"
                      onClick={() => setGoal(g)}
                      className={`${goal === g && "bg-slate-800 text-white"}`}
                    >
                      {g}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <H2>What are we cooking?</H2>
                <div className="flex flex-wrap gap-2">
                  {MEAL_TYPES.map((m) => (
                    <Button
                      key={m}
                      variant="secondary"
                      size="sm"
                      onClick={() => setMealType(m)}
                      className={`${mealType === m && "bg-slate-800 text-white"}`}
                    >
                      {m}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <H2>Equipment</H2>
                <div className="flex flex-wrap gap-2">
                  {EQUIPMENT.map((item) => {
                    const isSelected = equipments.includes(item);
                    return (
                      <Button
                        key={item}
                        variant="secondary"
                        size="sm"
                        onClick={() => toggleEquipment(item)}
                        className={`${isSelected && "bg-slate-800 text-white"}`}
                      >
                        {item}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className="text-xs font-bold uppercase text-slate-400 mb-3 block">Additional Requirement</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={additionalRequirement}
                    onChange={(e) => setAdditionalRequirement(e.target.value)}
                    placeholder="e.g. Only 200g of salmon. Avoid deep frying."
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black text-sm text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}
