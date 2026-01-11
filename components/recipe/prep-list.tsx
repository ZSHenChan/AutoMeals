import { useState } from "react";
import { Check } from "lucide-react";
import { RecipeData } from "./recipe-data"; // Ensure path matches your project

export function PrepList({
  ingredients,
}: {
  ingredients: RecipeData["ingredients"];
}) {
  const [preppedItems, setPreppedItems] = useState<string[]>([]);

  const togglePrep = (item: string) => {
    if (preppedItems.includes(item)) {
      setPreppedItems(preppedItems.filter((i) => i !== item));
    } else {
      setPreppedItems([...preppedItems, item]);
    }
  };

  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
        Mise en Place (Prep List)
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {ingredients.map((ing, i) => {
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
                    isPrepped ? "line-through text-gray-400" : "text-slate-700"
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
  );
}
