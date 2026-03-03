"use client";

import { useState } from "react";
import { promptOpenAI } from "@/lib/openai";
import { UserProfileSelector } from "@/components/userProfileSelector";
import { IngredientSelector } from "@/components/ingredientSelector";
import { PantryShelf } from "@/components/pantryShelf";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { RecipeData } from "@/components/recipe/recipe-data";
import { HeroSection } from "@/components/hero";
import { GenerateRecipeButton } from "@/components/button/generate-recipe-button";
import { usePreferencesContext } from "@/app/context/preferences-context";
import type { UserPreferences } from "@/types/preferences";

function SmartCookContent() {
  const [profileContext, setProfileContext] = useState("");
  const [ingredientsContext, setIngredientsContext] = useState("");
  const [pantryContext, setPantryContext] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipeResult, setRecipeResult] = useState<RecipeData | null>(null);
  const { userId, isReady, cookingSkill, equipments, ingredients, pantryShelf } =
    usePreferencesContext();

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
      const savePreferencesPromise = fetch(`/api/preferences?userId=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cookingSkill,
          equipments,
          ingredients,
          pantryShelf,
        } satisfies UserPreferences),
      });

      const generateRecipePromise = promptOpenAI(constructPrompt());

      const [saveResult, recipeResult] = await Promise.allSettled([savePreferencesPromise, generateRecipePromise]);

      if (recipeResult.status === "fulfilled") {
        setRecipeResult(recipeResult.value);
      } else {
        console.error("Recipe generation failed:", recipeResult.reason);
      }

      if (saveResult.status === "rejected") {
        console.warn("Failed to save preferences silently:", saveResult.reason);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (recipeResult) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans flex items-center justify-center">
        <div className="w-full max-w-md">
          <RecipeCard data={recipeResult} onReset={() => setRecipeResult(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans text-slate-800">
      <div className="min-h-screen max-w-3xl mx-auto space-y-10 pb-24 relative">
        <HeroSection />

        {isReady ? (
          <>
            <UserProfileSelector onContextUpdate={(ctx) => setProfileContext(ctx)} />
            <IngredientSelector onContextUpdate={(ctx) => setIngredientsContext(ctx)} />
            <PantryShelf onContextUpdate={(ctx) => setPantryContext(ctx)} />
          </>
        ) : (
          <UserProfileSelector onContextUpdate={(ctx) => setProfileContext(ctx)} />
        )}

        <GenerateRecipeButton
          onClick={generatePrompt}
          isDisabled={isGenerating || !isReady || ingredients.length === 0}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
}

export default function SmartCookPage() {
  return <SmartCookContent />;
}
