"use client";

import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";

interface GenerateRecipeButtonProps {
  onClick: () => void;
  isGenerating: boolean;
  isDisabled: boolean;
}

export function GenerateRecipeButton({
  onClick,
  isGenerating,
  isDisabled,
}: GenerateRecipeButtonProps) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 1. If at the very top, always show it
      if (currentScrollY < 10) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // 2. Determine direction
      // Scrolling DOWN (current > last) -> Hide
      // Scrolling UP (current < last) -> Show
      if (currentScrollY > lastScrollY.current) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`
        fixed left-0 right-0 z-50 flex justify-center px-4
        transition-all duration-300 ease-in-out
        ${
          isVisible
            ? "bottom-6 md:bottom-8 opacity-100"
            : "-bottom-24 opacity-0"
        }
      `}
    >
      <button
        onClick={onClick}
        disabled={isGenerating || isDisabled}
        className={`
            flex items-center justify-center gap-2 md:gap-3 
            w-full sm:w-auto
            px-6 py-3 md:px-8 md:py-4 
            rounded-full font-bold 
            text-base md:text-lg 
            shadow-2xl hover:shadow-xl 
            transition-transform hover:scale-105 active:scale-95 
            ${
              isDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }
        `}
      >
        {isGenerating ? (
          <span className="flex items-center gap-2">Thinking...</span>
        ) : (
          <>
            <Send className="w-4 h-4 md:w-5 md:h-5" /> Generate Recipe
          </>
        )}
      </button>
    </div>
  );
}
