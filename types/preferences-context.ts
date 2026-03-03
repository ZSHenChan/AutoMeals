import type { UserPreferences } from "@/types/preferences";
import type { ReactNode } from "react";

export interface PreferencesContextValue extends UserPreferences {
  userId: string;
  isReady: boolean;
  setIsReady: (ready: boolean) => void;
  hydratePreferences: (preferences: UserPreferences) => void;
  setCookingSkill: (skill: string) => void;
  setEquipments: (equipments: string[]) => void;
  setIngredients: (ingredients: string[]) => void;
  setPantryShelf: (pantryShelf: string[]) => void;
}

export interface PreferencesProviderProps {
  userId: string;
  children: ReactNode;
}
