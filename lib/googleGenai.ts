import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

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
  missingIngredients: z.array(z.string()),
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

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function promptGenai(prompt: string) {
  const jsonSchema = zodToJsonSchema(recipeSchema, { target: "jsonSchema7" });
  delete jsonSchema.$schema;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: jsonSchema as any,
    },
  });

  console.log(response.text);
  if (!response.text) throw new Error("No response from AI");

  const recipe = recipeSchema.parse(JSON.parse(response.text));
  return recipe;
}
