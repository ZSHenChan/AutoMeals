import { AlertCircle, ShoppingBag } from "lucide-react";

export function MissingIngredients({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div className="bg-red-50/80 border border-red-200 p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-red-100 p-2 rounded-full shrink-0">
          <AlertCircle className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h3 className="font-bold text-red-900 leading-tight">
            Missing Essentials
          </h3>
          <p className="text-xs text-red-700/80">
            You might need to buy these:
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-white border border-red-100 p-3 rounded-xl shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 text-red-400 shrink-0" />
            <span className="text-sm font-semibold text-red-900">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
