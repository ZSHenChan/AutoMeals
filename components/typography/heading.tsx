import { cn } from "@/lib/utils";

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
}

export const H1 = ({ children, className }: HeadingProps) => {
  return (
    <h1
      className={cn("text-lg md:text-2xl font-bold text-slate-900", className)}
    >
      {children}
    </h1>
  );
};

export const H2 = ({ children, className }: HeadingProps) => {
  return (
    <h2
      className={cn(
        "text-xs md:text-sm font-bold uppercase tracking-wider text-slate-400 mb-3",
        className
      )}
    >
      {children}
    </h2>
  );
};

export const H3 = ({ children, className }: HeadingProps) => {
  return (
    <h3
      className={cn("text-sm md:text-md font-bold text-slate-900", className)}
    >
      {children}
    </h3>
  );
};

export const ButtonH = ({ children, className }: HeadingProps) => {
  return (
    <h2 className={cn("font-semibold text-xs md:text-sm", className)}>
      {children}
    </h2>
  );
};

export const PrimarySubH = ({ children, className }: HeadingProps) => {
  return (
    <p className={cn("text-xs md:text-sm text-slate-500", className)}>
      {children}
    </p>
  );
};
