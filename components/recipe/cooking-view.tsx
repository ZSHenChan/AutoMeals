import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RecipeData } from "./recipe-data";

export function CookingView({
  data,
  onExit,
}: {
  data: RecipeData;
  onExit: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showIngredients, setShowIngredients] = useState(false);

  // Helper to highlight bold text
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

  return (
    <div className="bg-black text-white p-6 md:p-8 rounded-3xl min-h-150 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all">
      {/* Header */}
      <div className="flex justify-between items-start mb-6 z-10 relative">
        <div>
          <span className="text-xs font-bold tracking-widest text-gray-500 uppercase block mb-1">
            Step {currentStep + 1} of {data.steps.length}
          </span>
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
          <button onClick={onExit} className="text-gray-400 hover:text-red-400">
            Exit
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center">
        {showIngredients ? (
          <div className="w-full bg-gray-900/50 p-6 rounded-2xl border border-gray-800 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-gray-400 font-bold mb-4 uppercase text-sm tracking-wider">
              Quick Reference
            </h3>
            <ul className="grid gap-3">
              {data.ingredients.map((ing, i) => (
                <li
                  key={i}
                  className="text-sm flex justify-between border-b border-gray-800 pb-2"
                >
                  <span className="text-gray-300">{ing.name}</span>
                  <span className="font-mono text-orange-400">
                    {ing.quantity}
                  </span>
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
              else onExit();
            }}
            className="flex-2 py-4 rounded-full bg-orange-600 hover:bg-orange-500 text-black font-bold shadow-lg shadow-orange-900/20 transition-all active:scale-95"
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
