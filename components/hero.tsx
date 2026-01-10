import { ChefHat } from "lucide-react";
import { H1, PrimarySubH } from "./typography/heading";

export const HeroSection = () => {
  return (
    <div className="text-center space-y-2">
      <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-full mb-4">
        <ChefHat className="w-4 h-4 md:w-8 md:h-8 text-orange-600" />
      </div>
      <H1>What&apos;s in your kitchen?</H1>
      <PrimarySubH className="text-sm md:text-md text-slate-500">
        Select what you have, and we&apos;ll handle the thinking.
      </PrimarySubH>
    </div>
  );
};
