import { z } from "zod";

export const ingredientSchema = z.object({
  name: z.string().describe("Name of the ingredient."),
  quantity: z.string().describe("Quantity of the ingredient, including units."),
});

const recipeSchema = z.object({
  title: z.string().describe("The title of the meal recipe."),
  time: z
    .string()
    .describe(
      "Estimated cooking time for the meal (inclusive of preparation). Example: '15 Minutes'"
    ),
  ingredients: z
    .array(ingredientSchema)
    .describe("A list of mandatory ingredients with their portion"),
  missingIngredients: z
    .array(z.string())
    .describe(
      "A list of missing ingredients that is not provided by the user."
    ),
  steps: z
    .array(
      z
        .string()
        .describe(
          "Short description of current step to guide the user.  Use double star(**) to surround the important ingredients. Example: 'Pat the **Chicken Breast** dry with a paper towel and cut into bite-sized cubes.'"
        )
    )
    .describe("A list of steps guiding user to prepare the meal."),
});

export type GeneratedRecipe = z.infer<typeof recipeSchema>;

export const promptOpenAI = async (
  prompt: string
): Promise<GeneratedRecipe> => {
  const response = await fetch("/api/generate-recipe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch recipe");
  }

  const data = await response.json();
  return data as GeneratedRecipe;
};
