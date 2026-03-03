"use client";

import { createContext, useContext, useState } from "react";
import { DEFAULT_PREFERENCES } from "@/lib/preferences";
import { DEFAULT_USER_ID } from "@/lib/config";
import type { UserPreferences } from "@/types/preferences";
import type {
  PreferencesContextValue,
  PreferencesProviderProps,
} from "@/types/preferences-context";

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

export function PreferencesProvider({ userId, children }: PreferencesProviderProps) {
  const [isReady, setIsReady] = useState(userId === DEFAULT_USER_ID);
  const [cookingSkill, setCookingSkill] = useState(DEFAULT_PREFERENCES.cookingSkill);
  const [equipments, setEquipments] = useState<string[]>(DEFAULT_PREFERENCES.equipments);
  const [ingredients, setIngredients] = useState<string[]>(DEFAULT_PREFERENCES.ingredients);
  const [pantryShelf, setPantryShelf] = useState<string[]>(DEFAULT_PREFERENCES.pantryShelf);

  const hydratePreferences = (preferences: UserPreferences) => {
    setCookingSkill(preferences.cookingSkill);
    setEquipments(preferences.equipments);
    setIngredients(preferences.ingredients);
    setPantryShelf(preferences.pantryShelf);
  };

  return (
    <PreferencesContext.Provider
      value={{
        userId,
        isReady,
        setIsReady,
        hydratePreferences,
        cookingSkill,
        equipments,
        ingredients,
        pantryShelf,
        setCookingSkill,
        setEquipments,
        setIngredients,
        setPantryShelf,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferencesContext() {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error("usePreferencesContext must be used within PreferencesProvider");
  }

  return context;
}
