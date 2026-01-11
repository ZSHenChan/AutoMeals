import { Clock, ChefHat } from "lucide-react";
import { RecipeData } from "./recipe-data";
import { MissingIngredients } from "./missing-ingredients";
import { PrepList } from "./prep-list";

export function OverviewView({
  data,
  onStartCooking,
  onReset,
}: {
  data: RecipeData;
  onStartCooking: () => void;
  onReset: () => void;
}) {
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
        <MissingIngredients items={data.missingIngredients} />
        <PrepList ingredients={data.ingredients} />

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
          <button
            onClick={onStartCooking}
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
