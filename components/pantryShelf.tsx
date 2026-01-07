"use client";

import { useState, useEffect } from "react";
import { Trash2, ChevronUp, Plus, ChevronDown } from "lucide-react";

// --- CONSTANTS ---
const DEFAULT_PANTRY_STAPLES = [
  "Cooking Oil",
  "Salt",
  "Black Pepper",
  "Soy Sauce",
  "Garlic",
];

const SUGGESTED_STAPLES = [
  "Sugar",
  "Sesame Oil",
  "Butter",
  "Ketchup",
  "Chili Sauce",
  "Vinegar",
  "Cornstarch",
];

// --- INTERFACE ---
interface PantryShelfProps {
  onContextUpdate: (contextString: string) => void;
}

export function PantryShelf({ onContextUpdate }: PantryShelfProps) {
  // --- INTERNAL STATE ---
  const [items, setItems] = useState<string[]>(DEFAULT_PANTRY_STAPLES);

  // UI States
  const [isOpen, setIsOpen] = useState(false); // Default to collapsed
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // --- LOGIC ---
  const handleAdd = (item: string) => {
    const trimmed = item.trim();
    if (trimmed && !items.includes(trimmed)) {
      setItems([...items, trimmed]);
      setInputValue("");
    }
  };

  const handleRemove = (item: string) => {
    setItems(items.filter((i) => i !== item));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd(inputValue);
    }
  };

  // --- SYNC WITH PARENT ---
  useEffect(() => {
    const contextString =
      items.length > 0
        ? `Available Pantry Items: ${items.join(", ")}`
        : "No Pantry Items Available.";

    onContextUpdate(contextString);
  }, [items, onContextUpdate]);

  return (
    <div className="bg-amber-50/50 rounded-2xl border border-amber-100 mb-8 overflow-hidden transition-all duration-300">
      {/* 1. CLICKABLE HEADER */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-amber-100/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="bg-amber-100 p-2 rounded-full text-amber-700">
            {/* Simple Shelf Icon */}
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-900">Pantry Shelf</h3>
            <p className="text-sm text-amber-700/60">
              {items.length === 0
                ? "Empty"
                : `${items.length} items • ${items.slice(0, 3).join(", ")}${
                    items.length > 3 ? "..." : ""
                  }`}
            </p>
          </div>
        </div>

        {/* Chevron Animation */}
        <ChevronDown
          className={`w-5 h-5 text-amber-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* 2. COLLAPSIBLE CONTENT */}
      {isOpen && (
        <div className="p-6 pt-0 border-t border-amber-100 animate-in slide-in-from-top-2 fade-in duration-200">
          <p className="text-xs text-amber-700/60 mb-6 mt-6">
            Items you already have at home (Oil, Seasonings, Sauces).
          </p>

          {/* THE SHELF GRID */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {/* Render Items */}
            {items.map((item) => (
              <button
                key={item}
                onClick={() => handleRemove(item)}
                className="group relative aspect-square bg-white rounded-xl border-2 border-amber-200 shadow-sm hover:border-red-300 hover:bg-red-50 transition-all flex flex-col items-center justify-center p-2 text-center"
              >
                <div className="w-8 h-1 rounded-full bg-amber-200 mb-2 group-hover:bg-red-200 transition-colors"></div>
                <span className="text-xs font-bold text-amber-900 leading-tight group-hover:text-red-600 line-clamp-2">
                  {item}
                </span>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 rounded-xl backdrop-blur-[1px]">
                  <Trash2 className="w-6 h-6 text-red-500" />
                </div>
              </button>
            ))}

            {/* Add Button */}
            <button
              onClick={() => setIsAdding(!isAdding)}
              className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all ${
                isAdding
                  ? "border-amber-500 bg-amber-100 text-amber-800"
                  : "border-amber-300 text-amber-400 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50"
              }`}
            >
              {isAdding ? (
                <ChevronUp className="w-6 h-6" />
              ) : (
                <Plus className="w-6 h-6" />
              )}
              <span className="text-xs font-bold uppercase">
                {isAdding ? "Close" : "Add"}
              </span>
            </button>
          </div>

          {/* EXPANDABLE ADD MENU */}
          {isAdding && (
            <div className="mt-6 pt-6 border-t border-amber-200 animate-in slide-in-from-top-2 fade-in">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type item..."
                  className="flex-1 border border-amber-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-800"
                />
                <button
                  onClick={() => handleAdd(inputValue)}
                  className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-amber-600"
                >
                  Add
                </button>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 mb-2 block">
                  Quick Add Staples
                </span>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_STAPLES.filter((i) => !items.includes(i)).map(
                    (item) => (
                      <button
                        key={item}
                        onClick={() => handleAdd(item)}
                        className="px-3 py-1 bg-white border border-amber-100 rounded-full text-xs font-medium text-amber-800 hover:bg-amber-200 transition-colors"
                      >
                        + {item}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
