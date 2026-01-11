"use client";

import { useEffect, useState, useMemo } from "react";
import { Utensils, Check, ChevronDown, Search, Plus, X } from "lucide-react";
import { INGREDIENTS } from "@/lib/config";
import { H2, H3 } from "./typography/heading";
import { Button } from "./button/clickable";

const ALL_PREDEFINED = Object.values(INGREDIENTS).flat();
const CATEGORIES = Object.keys(INGREDIENTS);

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
    <div className="flex mb-4 items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
      <div className="flex flex-col text-left">
        <span className="text-sm font-bold text-slate-800">
          Allow Extra Ingredients?
        </span>
        <span className="text-[10px] text-slate-500 font-medium">
          {allowExtras
            ? "Chef can suggest items to buy"
            : "Strict: Cook ONLY with what I have"}
        </span>
      </div>

      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={allowExtras}
          onChange={(e) => setAllowExtras(e.target.checked)}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
      </label>
    </div>
  );
};

export function IngredientSelector({
  onContextUpdate,
}: IngredientSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(CATEGORIES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [allowExtras, setAllowExtras] = useState(true);

  // -- LOGIC: Context Update --
  const strictModeInstruction = allowExtras
    ? "If essential items are missing (Oil, Salt, etc), list them."
    : "STRICT MODE: Only use provided ingredients.";

  useEffect(() => {
    const promptPayload =
      selectedItems.length === 0
        ? ""
        : `AVAILABLE INGREDIENTS:\n${selectedItems.join(
            ", "
          )}\n${strictModeInstruction}`;
    onContextUpdate(promptPayload);
  }, [selectedItems, onContextUpdate, strictModeInstruction]);

  // -- LOGIC: Filtering --
  // 1. If Searching: Search across ALL categories
  // 2. If Not Searching: Show only items in Active Tab
  const visibleIngredients = useMemo(() => {
    if (!searchQuery.trim()) {
      return INGREDIENTS[activeTab as keyof typeof INGREDIENTS] || [];
    }
    return ALL_PREDEFINED.filter((item) =>
      item.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeTab, searchQuery]);

  const handleToggle = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems((prev) => prev.filter((i) => i !== item));
    } else {
      setSelectedItems((prev) => [...prev, item]);
    }
  };

  const handleAddCustom = () => {
    const trimmed = searchQuery.trim();
    if (trimmed && !selectedItems.includes(trimmed)) {
      handleToggle(trimmed);
      setSearchQuery(""); // Clear search after adding
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300">
      {/* HEADER */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-full transition-colors ${
              selectedItems.length > 0
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <H3>Ingredients</H3>
            <p className="text-sm text-slate-500">
              {selectedItems.length === 0
                ? "What's in your fridge?"
                : `${selectedItems.length} selected`}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="p-6 pt-0 border-t border-gray-100 animate-in slide-in-from-top-2 fade-in duration-200">
          {/* 1. CONTROLS SECTION */}
          <div className="space-y-4 mt-6">
            <AllowExtraToggle
              allowExtras={allowExtras}
              setAllowExtras={setAllowExtras}
            />

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search (e.g. 'Chicken', 'Tofu')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCustom()}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all text-sm"
              />
            </div>

            {/* Category Tabs (Only show if NOT searching) */}
            {searchQuery.trim() === "" && (
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      activeTab === cat
                        ? "bg-black text-white shadow-md"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. BASKET (Selected Items) */}
          {selectedItems.length > 0 && (
            <div className="mb-6 mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
              <h4 className="text-xs font-bold text-blue-800 uppercase mb-2 flex justify-between items-center">
                Your Basket
                <span className="text-blue-500 font-normal normal-case">
                  Tap to remove
                </span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleToggle(item)}
                    className="group flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-200 text-blue-700 rounded-lg text-xs font-semibold shadow-sm hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition-all"
                  >
                    {item}
                    <X className="w-3 h-3 text-blue-400 group-hover:text-red-500" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. INGREDIENTS GRID */}
          <div className="mt-4">
            <H2 className="mb-3 capitalize">
              {searchQuery ? "Search Results" : activeTab}
            </H2>

            <div className="flex flex-wrap gap-2 min-h-25 content-start">
              {visibleIngredients.map((item) => {
                const isSelected = selectedItems.includes(item);
                return (
                  <Button
                    key={item}
                    variant="outline"
                    size="xs"
                    onClick={() => handleToggle(item)}
                    className={`flex transition-all duration-200 ${
                      isSelected
                        ? "opacity-50 grayscale cursor-not-allowed bg-gray-100" // Visual feedback that it's already in basket
                        : "hover:border-black hover:scale-105"
                    }`}
                  >
                    {item}
                    {isSelected && <Check className="w-3 h-3 ml-1" />}
                  </Button>
                );
              })}

              {/* Empty State / Custom Add */}
              {visibleIngredients.length === 0 && searchQuery && (
                <button
                  onClick={handleAddCustom}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add &quot;{searchQuery}&quot;
                </button>
              )}

              {visibleIngredients.length === 0 && !searchQuery && (
                <p className="text-gray-400 text-sm italic">No items here.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
