import { DEFAULT_PANTRY_SHELF, SKILL_LEVELS } from "@/lib/config";
import type { UserPreferences } from "@/types/preferences";

export const DEFAULT_PREFERENCES: UserPreferences = {
  pantryShelf: DEFAULT_PANTRY_SHELF,
  ingredients: [],
  equipments: [],
  cookingSkill: SKILL_LEVELS[0].id,
};

export function mergePreferences(
  partial?: Partial<UserPreferences> | null
): UserPreferences {
  return {
    pantryShelf: partial?.pantryShelf ?? DEFAULT_PREFERENCES.pantryShelf,
    ingredients: partial?.ingredients ?? DEFAULT_PREFERENCES.ingredients,
    equipments: partial?.equipments ?? DEFAULT_PREFERENCES.equipments,
    cookingSkill: partial?.cookingSkill ?? DEFAULT_PREFERENCES.cookingSkill,
  };
}
