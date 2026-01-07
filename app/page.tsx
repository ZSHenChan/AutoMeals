"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { promptOpenAI } from "@/lib/openai";
import { IngredientSelector } from "@/components/ingredientSelector";
import { UserProfileSelector } from "@/components/userProfileSelector";
import { PantryShelf } from "@/components/pantryShelf";
import { RecipeCard, RecipeData } from "@/components/recipeCard";
import { HeroSection } from "@/components/hero";

export default function SmartCookPage() {
  const [profileContext, setProfileContext] = useState("");
  const [ingredientsContext, setingredientsContext] = useState<string>("");
  const [pantryContext, setPantryContext] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [recipeResult, setRecipeResult] = useState<RecipeData | null>(null);

  const constructPrompt = () => {
    const prompt = `Generate a recipe that fulfills user requirement:
    ${profileContext}
    ${ingredientsContext}
    ${pantryContext}

    You dont have to use all the ingredients provided.
    `;

    return prompt;
  };

  const generatePrompt = async () => {
    setIsGenerating(true);

    try {
      const data = await promptOpenAI(constructPrompt());
      setRecipeResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // If we have a result, show the RecipeCard instead of the form
  if (recipeResult) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans flex items-center justify-center">
        <div className="w-full max-w-md">
          <RecipeCard
            data={recipeResult}
            onReset={() => setRecipeResult(null)}
          />
        </div>
      </div>
    );
  }

  // Otherwise, show the Form
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans text-slate-800">
      <div className="min-h-screen max-w-3xl mx-auto space-y-10">
        <HeroSection />

        {/* PROFILE SECTION */}
        <UserProfileSelector
          onContextUpdate={(ctx) => setProfileContext(ctx)}
        />

        {/* INGREDIENT SECTION */}
        <IngredientSelector
          onContextUpdate={(ctx) => setingredientsContext(ctx)}
        />

        {/* PANTRY SECTION */}
        <PantryShelf onContextUpdate={(ctx) => setPantryContext(ctx)} />

        {/* PROMPT LLM BUTTON */}
        <div className="sticky bottom-2 flex justify-center">
          <button
            onClick={generatePrompt}
            disabled={isGenerating || ingredientsContext.trim() === ""}
            className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-all hover:scale-105 ${
              ingredientsContext.trim() === ""
                ? "bg-gray-300 text-gray-500"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {isGenerating ? (
              "Thinking..."
            ) : (
              <>
                <Send className="w-5 h-5" /> Generate Recipe
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
