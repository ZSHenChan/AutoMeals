import { ChefHat } from "lucide-react";

export const HeroSection = () => {
  return (
    <div className="text-center space-y-2">
      <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-full mb-4">
        <ChefHat className="w-8 h-8 text-orange-600" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900">
        What&apos;s in your kitchen?
      </h1>
      <p className="text-slate-500">
        Select what you have, and we&apos;ll handle the thinking.
      </p>
    </div>
  );
};
