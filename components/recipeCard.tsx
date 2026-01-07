import { useState } from "react";
import {
  ChefHat,
  Check,
  Clock,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  ShoppingBag,
} from "lucide-react";
import { ingredientSchema, GeneratedRecipe } from "@/lib/openai";
import { z } from "zod";

// --- 1. TYPES & MOCK DATA ---
export type Ingredient = z.infer<typeof ingredientSchema>;

export type RecipeData = GeneratedRecipe;

// --- 2. COMPONENT: RECIPE DISPLAY (The Result) ---

export function RecipeCard({
  data,
  onReset,
}: {
  data: RecipeData;
  onReset: () => void;
}) {
  const [mode, setMode] = useState<"overview" | "cooking">("overview");
  const [currentStep, setCurrentStep] = useState(0);
  const [showIngredients, setShowIngredients] = useState(false); // New state for cooking mode
  const [preppedItems, setPreppedItems] = useState<string[]>([]); // Track what user has checked off

  // Helper to toggle checklist state
  const togglePrep = (item: string) => {
    if (preppedItems.includes(item)) {
      setPreppedItems(preppedItems.filter((i) => i !== item));
    } else {
      setPreppedItems([...preppedItems, item]);
    }
  };

  // Helper to highlight bold text from LLM (markdown style **)
  const parseText = (text: string) => {
    const parts = text.split("**");
    return parts.map((part, i) =>
      i % 2 === 1 ? (
        <span key={i} className="font-bold text-orange-600">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  if (mode === "cooking") {
    return (
      <div className="bg-black text-white p-6 md:p-8 rounded-3xl min-h-[600px] flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all">
        {/* Header: Step Counter & Exit */}
        <div className="flex justify-between items-start mb-6 z-10 relative">
          <div>
            <span className="text-xs font-bold tracking-widest text-gray-500 uppercase block mb-1">
              Step {currentStep + 1} of {data.steps.length}
            </span>
            {/* Progress Bar */}
            <div className="h-1 w-24 bg-gray-800 rounded-full mt-2">
              <div
                className="h-1 bg-orange-500 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentStep + 1) / data.steps.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="flex gap-4 text-sm">
            <button
              onClick={() => setShowIngredients(!showIngredients)}
              className="text-gray-400 hover:text-white underline decoration-dotted"
            >
              {showIngredients ? "Hide Ingredients" : "View Ingredients"}
            </button>
            <button
              onClick={() => setMode("overview")}
              className="text-gray-400 hover:text-red-400"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Content: Either the Step OR the Ingredients Overlay */}
        <div className="flex-1 flex items-center">
          {showIngredients ? (
            <div className="w-full bg-gray-900/50 p-6 rounded-2xl border border-gray-800 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-gray-400 font-bold mb-4 uppercase text-sm tracking-wider">
                Quick Reference
              </h3>
              <ul className="grid grid-cols-2 gap-3">
                {data.ingredients.map((ing, i) => (
                  <li
                    key={i}
                    className="text-sm justify-between border-b border-gray-800 pb-2"
                  >
                    <p className="text-gray-300">{ing.name}</p>
                    <p className="font-mono text-orange-400">{ing.quantity}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <h2 className="text-2xl md:text-4xl font-bold leading-tight animate-in slide-in-from-right-8 duration-300">
              {parseText(data.steps[currentStep])}
            </h2>
          )}
        </div>

        {/* Controls */}
        {!showIngredients && (
          <div className="flex gap-4 mt-8 z-10 relative">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="flex-1 py-4 rounded-full bg-gray-800 text-gray-300 disabled:opacity-30 font-bold transition-all active:scale-95"
            >
              <ChevronLeft className="inline w-5 h-5" /> Prev
            </button>
            <button
              onClick={() => {
                if (currentStep < data.steps.length - 1)
                  setCurrentStep(currentStep + 1);
                else setMode("overview");
              }}
              className="flex-[2] py-4 rounded-full bg-orange-600 hover:bg-orange-500 text-black font-bold shadow-lg shadow-orange-900/20 transition-all active:scale-95"
            >
              {currentStep === data.steps.length - 1 ? (
                "Finish!"
              ) : (
                <>
                  Next <ChevronRight className="inline w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
  }

  // --- OVERVIEW MODE (Prep Screen) ---
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="bg-orange-50/50 p-8 border-b border-orange-100">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">{data.title}</h2>
        <div className="flex gap-4 text-sm font-bold text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-orange-500" /> {data.time}
          </span>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Missing Ingredients Alert */}
        {data.missingIngredients.length > 0 && (
          <div className="bg-red-50/80 border border-red-200 p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-red-900 leading-tight">
                  Missing Essentials
                </h3>
                <p className="text-xs text-red-700/80">
                  You might need to buy these:
                </p>
              </div>
            </div>

            {/* Listed Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {data.missingIngredients.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-white border border-red-100 p-3 rounded-xl shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="text-sm font-semibold text-red-900">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INGREDIENTS LIST (Beautified) */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
            Mise en Place (Prep List)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.ingredients.map((ing, i) => {
              const isPrepped = preppedItems.includes(ing.name);
              return (
                <button
                  key={i}
                  onClick={() => togglePrep(ing.name)}
                  className={`group flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                    isPrepped
                      ? "bg-gray-50 border-gray-100 opacity-50"
                      : "bg-white border-gray-200 hover:border-orange-200 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isPrepped
                          ? "bg-green-500 border-green-500"
                          : "border-gray-300 group-hover:border-orange-300"
                      }`}
                    >
                      {isPrepped && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span
                      className={`font-medium ${
                        isPrepped
                          ? "line-through text-gray-400"
                          : "text-slate-700"
                      }`}
                    >
                      {ing.name}
                    </span>
                  </div>
                  <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                    {ing.quantity}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
          <button
            onClick={() => setMode("cooking")}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg shadow-lg shadow-slate-200 hover:bg-slate-800 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            <ChefHat className="w-5 h-5" /> Start Cooking
          </button>

          <button
            onClick={onReset}
            className="w-full py-3 text-slate-400 text-sm font-semibold hover:text-slate-600"
          >
            Generate New Recipe
          </button>
        </div>
      </div>
    </div>
  );
}
