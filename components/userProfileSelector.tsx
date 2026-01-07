"use client";

import { useState, useEffect } from "react";
import { Flame, ChevronDown, User, Settings2 } from "lucide-react";
import { SKILL_LEVELS, GOALS, MEAL_TYPES, EQUIPMENT } from "@/lib/config";

// --- INTERFACE ---
interface UserProfileSelectorProps {
  onContextUpdate: (contextString: string) => void;
}

export function UserProfileSelector({
  onContextUpdate,
}: UserProfileSelectorProps) {
  // --- UI STATE ---
  const [isOpen, setIsOpen] = useState(true);

  // --- DATA STATE ---
  const [skill, setSkill] = useState(SKILL_LEVELS[0].id);
  const [goal, setGoal] = useState(GOALS[0]);
  const [mealType, setMealType] = useState(MEAL_TYPES[0]);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [additionalRequirement, setAdditionalRequirement] =
    useState<string>("");

  // --- LOGIC ---
  const toggleEquipment = (item: string) => {
    if (equipment.includes(item)) {
      setEquipment(equipment.filter((i) => i !== item));
    } else {
      setEquipment([...equipment, item]);
    }
  };

  // Helper to get label for summary
  const currentSkillLabel = SKILL_LEVELS.find((s) => s.id === skill)?.label;

  // --- SYNC WITH PARENT ---
  useEffect(() => {
    const formattedString = `
      - Cooking Skill: ${currentSkillLabel || skill}
      - Meal Type: ${mealType}
      - Dietary Goal: ${goal}
      - Available Equipment: ${equipment.join(", ") || "None"}
      - Additional Requirement: ${additionalRequirement}
    `.trim();

    onContextUpdate(formattedString);
  }, [
    skill,
    goal,
    mealType,
    equipment,
    additionalRequirement,
    onContextUpdate,
    currentSkillLabel,
  ]);

  const equipmentSummary =
    equipment.length === 0
      ? ""
      : equipment.length === 1
      ? ` • ${equipment[0]}`
      : ` • ${equipment.length} Equipments`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300">
      {/* 1. CLICKABLE HEADER */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 text-orange-600 p-2 rounded-full">
            <Settings2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Preferences</h3>
            <p className="text-sm text-slate-500">
              {currentSkillLabel} • {goal} • {mealType}
              {equipmentSummary}
            </p>
          </div>
        </div>

        {/* Chevron Animation */}
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* 2. COLLAPSIBLE CONTENT */}
      {isOpen && (
        <div className="p-6 pt-0 border-t border-gray-100 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="space-y-6 mt-6">
            {/* SKILL LEVEL */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Flame className="w-4 h-4" /> Cooking Skill
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {SKILL_LEVELS.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setSkill(level.id)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      skill === level.id
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-gray-200 hover:border-orange-200"
                    }`}
                  >
                    <div className="font-semibold text-sm">{level.label}</div>
                    <div className="text-xs text-slate-500">{level.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* GOAL */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Today&apos;s Goal
              </h3>
              <div className="flex flex-wrap gap-2">
                {GOALS.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGoal(g)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                      goal === g
                        ? "bg-slate-800 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* MEAL TYPE */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                What are we cooking?
              </h3>
              <div className="flex flex-wrap gap-2">
                {MEAL_TYPES.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMealType(m)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                      mealType === m
                        ? "bg-slate-800 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* EQUIPMENT */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Equipment
              </h3>
              <div className="flex flex-wrap gap-2">
                {EQUIPMENT.map((item) => {
                  const isSelected = equipment.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => toggleEquipment(item)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                        isSelected
                          ? "bg-slate-800 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ADDITIONAL REQUIREMENTS */}
            <div className="pt-4 border-t border-gray-100">
              <label className="text-xs font-bold uppercase text-slate-400 mb-3 block">
                Additional Requirement
              </label>
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
