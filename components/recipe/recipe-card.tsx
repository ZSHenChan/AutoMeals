"use client";

import { useState } from "react";
import { RecipeData } from "./recipe-data";
import { CookingView } from "./cooking-view";
import { OverviewView } from "./overview-view";

export function RecipeCard({
  data,
  onReset,
}: {
  data: RecipeData;
  onReset: () => void;
}) {
  const [mode, setMode] = useState<"overview" | "cooking">("overview");

  if (mode === "cooking") {
    return <CookingView data={data} onExit={() => setMode("overview")} />;
  }

  return (
    <OverviewView
      data={data}
      onStartCooking={() => setMode("cooking")}
      onReset={onReset}
    />
  );
}
