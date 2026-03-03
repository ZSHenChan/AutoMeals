import { z } from "zod";
import { ingredientSchema, recipeSchema } from "@/lib/openai";

export type Ingredient = z.infer<typeof ingredientSchema>;
export type GeneratedRecipe = z.infer<typeof recipeSchema>;
export type RecipeData = GeneratedRecipe;
