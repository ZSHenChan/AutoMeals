import { ingredientSchema, GeneratedRecipe } from "@/lib/openai";
import { z } from "zod";

export type Ingredient = z.infer<typeof ingredientSchema>;

export type RecipeData = GeneratedRecipe;
