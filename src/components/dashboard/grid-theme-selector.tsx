"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type GridTheme = "emerald" | "amethyst" | "ocean" | "sunset" | "rose" | "monochrome";

export const GRID_THEMES: Record<GridTheme, { name: string; colors: string[] }> = {
  emerald: {
    name: "Emerald",
    colors: ["bg-muted/30", "bg-emerald-200", "bg-emerald-400", "bg-emerald-600", "bg-emerald-800"]
  },
  amethyst: {
    name: "Amethyst",
    colors: ["bg-muted/30", "bg-purple-200", "bg-purple-400", "bg-purple-600", "bg-purple-800"]
  },
  ocean: {
    name: "Ocean",
    colors: ["bg-muted/30", "bg-blue-200", "bg-blue-400", "bg-blue-600", "bg-blue-800"]
  },
  sunset: {
    name: "Sunset",
    colors: ["bg-muted/30", "bg-orange-200", "bg-orange-400", "bg-orange-600", "bg-orange-800"]
  },
  rose: {
    name: "Rose",
    colors: ["bg-muted/30", "bg-rose-200", "bg-rose-400", "bg-rose-600", "bg-rose-800"]
  },
  monochrome: {
    name: "Monochrome",
    colors: ["bg-muted/30", "bg-stone-300", "bg-stone-500", "bg-stone-700", "bg-stone-900"]
  }
};

interface GridThemeSelectorProps {
  currentTheme: GridTheme;
  onThemeChange: (theme: GridTheme) => void;
}

export function GridThemeSelector({ currentTheme, onThemeChange }: GridThemeSelectorProps) {
  const themes = Object.entries(GRID_THEMES) as [GridTheme, typeof GRID_THEMES[GridTheme]][];

  return (
    <div className="flex items-center gap-2">
      {themes.map(([key, theme]) => {
        const isSelected = currentTheme === key;
        const color = theme.colors[4]; // Use darkest color for the swatch

        return (
          <button
            key={key}
            onClick={() => onThemeChange(key)}
            className={cn(
              "relative w-6 h-6 rounded-full flex items-center justify-center transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              color,
              isSelected ? "ring-2 ring-offset-2 ring-primary scale-110" : "hover:scale-110 shadow-sm"
            )}
            title={`Select ${theme.name} theme`}
            aria-label={`Select ${theme.name} theme`}
          >
            {isSelected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
          </button>
        );
      })}
    </div>
  );
}
