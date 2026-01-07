// app/api/generate-recipe/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";

// 1. Initialize OpenAI (Securely on server)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // No NEXT_PUBLIC here!
});

// 2. Define Schemas (Same as before)
const ingredientSchema = z.object({
  name: z.string().describe("Name of the ingredient."),
  quantity: z.string().describe("Quantity of the ingredient, including units."),
});

const recipeSchema = z.object({
  title: z.string().describe("The title of the meal recipe."),
  time: z.string().describe("Estimated cooking time. Example: '15 Minutes'"),
  ingredients: z.array(ingredientSchema),
  missingIngredients: z
    .array(z.string())
    .describe("List of missing ingredients."),
  steps: z.array(z.string()).describe("Step by step cooking guide."),
});

// 3. Handle the POST Request
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const response = await openai.responses.parse({
      model: "gpt-5-mini-2025-08-07",
      input: [
        { role: "system", content: "Extract the event information." },
        {
          role: "user",
          content: prompt,
        },
      ],
      text: {
        format: zodTextFormat(recipeSchema, "event"),
      },
    });

    const data = response.output_parsed;

    if (!data) {
      return NextResponse.json(
        { error: "Failed to generate recipe" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
