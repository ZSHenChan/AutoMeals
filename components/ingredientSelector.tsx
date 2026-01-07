"use client";

import { useEffect, useState } from "react";
import { Utensils, Check, ChevronDown } from "lucide-react"; // Added ChevronDown
import { INGREDIENTS } from "@/lib/config";

// Flatten list to helper identify "Custom" vs "Predefined" items
const ALL_PREDEFINED = Object.values(INGREDIENTS).flat();

interface IngredientSelectorProps {
  onContextUpdate: (contextString: string) => void;
}

export interface AllowExtraToggleProps {
  allowExtras: boolean;
  setAllowExtras: (arg0: boolean) => void;
}

const AllowExtraToggle = ({
  allowExtras,
  setAllowExtras,
}: AllowExtraToggleProps) => {
  return (
    <div className="flex mb-6 bg-gray-50 p-2 rounded-xl border border-gray-100">
      <label className="flex items-center gap-3 cursor-pointer group w-full p-1">
        {/* The Invisible Checkbox */}
        <input
          type="checkbox"
          className="sr-only peer"
          checked={allowExtras}
          onChange={(e) => setAllowExtras(e.target.checked)}
        />

        {/* The Switch Visual */}
        <div className="relative w-10 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-black transition-all shrink-0">
          {/* The Knob */}
          <div
            className={`absolute top-[2px] left-[2px] bg-white border-gray-300 border rounded-full h-5 w-5 transition-all ${
              allowExtras ? "translate-x-[80%] border-white" : ""
            }`}
          ></div>
        </div>

        {/* Label Text */}
        <div className="flex flex-col text-left">
          <span className="text-sm font-bold text-slate-800">
            Allow Extra Ingredients
          </span>
          <span className="text-[10px] text-slate-500 font-medium">
            {allowExtras
              ? "Chef can suggest items to buy"
              : "Strict mode: Cook ONLY with what I have"}
          </span>
        </div>
      </label>
    </div>
  );
};

export function IngredientSelector({
  onContextUpdate,
}: IngredientSelectorProps) {
  // UI State for Collapsible
  const [isOpen, setIsOpen] = useState(false); // Default to collapsed to save space

  // Data State
  const [inputValue, setInputValue] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [allowExtras, setAllowExtras] = useState(true);

  const strictModeInstruction = allowExtras
    ? "If the recipe needs essential items I didn't list (like Oil, Salt, specific sauces), list them in 'missingIngredients'."
    : "STRICT MODE ACTIVE: You must ONLY use the ingredients listed above. Do NOT suggest buying new items. If the result is simple or dry, that is acceptable. Do not populate 'missingIngredients'.";

  useEffect(() => {
    const promptPayload =
      selectedItems.length === 0
        ? ""
        : `
      AVAILABLE INGREDIENTS:
      ${selectedItems.join(", ")}
      ${strictModeInstruction}
    `.trim();
    onContextUpdate(promptPayload);
  }, [selectedItems, onContextUpdate, strictModeInstruction]);

  const handleToggleIngredient = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleAddCustom = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      if (!selectedItems.includes(trimmed)) {
        handleToggleIngredient(trimmed);
      }
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustom();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300">
      {/* 1. CLICKABLE HEADER */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-full ${
              selectedItems.length > 0
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Ingredients</h3>
            <p className="text-sm text-slate-500">
              {selectedItems.length === 0
                ? "Select what you have in the fridge"
                : `${selectedItems.length} item${
                    selectedItems.length === 1 ? "" : "s"
                  } selected • ${
                    allowExtras ? "Allow" : "No"
                  } Extra Ingredients`}
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
      {/* We use a conditional render or CSS display here. Conditional is cleaner for DOM. */}
      {isOpen && (
        <div className="p-6 pt-0 border-t border-gray-100 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="mt-6">
            <AllowExtraToggle
              allowExtras={allowExtras}
              setAllowExtras={setAllowExtras}
            />
          </div>

          <div className="space-y-8">
            {/* PREDEFINED LISTS */}
            {Object.entries(INGREDIENTS).map(([category, items]) => (
              <div key={category}>
                <h4 className="text-xs font-bold uppercase text-slate-400 mb-3">
                  {category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => {
                    const isSelected = selectedItems.includes(item);
                    return (
                      <button
                        key={item}
                        onClick={() => handleToggleIngredient(item)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-all ${
                          isSelected
                            ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200"
                            : "bg-white border-slate-200 text-slate-600 hover:border-blue-400"
                        }`}
                      >
                        {item}
                        {isSelected && <Check className="w-3 h-3" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* CUSTOM INPUT FIELD */}
            <div className="pt-4 border-t border-gray-100">
              <label className="text-xs font-bold uppercase text-slate-400 mb-3 block">
                Not on the list? Add your own:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. Kimchi, Spam, Cheese..."
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                />
                <button
                  onClick={handleAddCustom}
                  disabled={!inputValue.trim()}
                  className="bg-black text-white px-6 rounded-xl font-bold text-sm disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>

            {/* DISPLAY "EXTRAS" */}
            {selectedItems.some((i) => !ALL_PREDEFINED.includes(i)) && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <h4 className="text-xs font-bold uppercase text-purple-600 mb-2">
                  Your Extras
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedItems
                    .filter((item) => !ALL_PREDEFINED.includes(item))
                    .map((item) => (
                      <button
                        key={item}
                        onClick={() => handleToggleIngredient(item)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-purple-100 text-purple-700 border border-purple-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all group"
                      >
                        {item}
                        <span className="bg-purple-200 group-hover:bg-red-200 text-xs w-4 h-4 flex items-center justify-center rounded-full">
                          ✕
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
