"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function SettingsAppearance() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting until mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-36 animate-pulse bg-muted rounded-2xl border border-border" />
        ))}
      </div>
    );
  }

  const options = [
    {
      value: "light",
      label: "Light Mode",
      icon: Sun,
      description: "Clean, crisp, and high-contrast styling.",
      preview: (
        <div className="w-full h-8 bg-slate-50 border border-slate-100 rounded-lg flex items-center p-1.5 gap-1">
          <div className="h-2 w-6 bg-primary rounded" />
          <div className="h-1.5 w-1.5 bg-slate-200 rounded-full ml-auto" />
          <div className="h-1.5 w-1.5 bg-slate-300 rounded-full" />
        </div>
      ),
    },
    {
      value: "dark",
      label: "Dark Mode",
      icon: Moon,
      description: "Easy on the eyes, low blue light.",
      preview: (
        <div className="w-full h-8 bg-slate-900 border border-slate-800 rounded-lg flex items-center p-1.5 gap-1">
          <div className="h-2 w-6 bg-primary rounded" />
          <div className="h-1.5 w-1.5 bg-slate-800 rounded-full ml-auto" />
          <div className="h-1.5 w-1.5 bg-slate-700 rounded-full" />
        </div>
      ),
    },
    {
      value: "system",
      label: "System",
      icon: Laptop,
      description: "Follows your device preferences.",
      preview: (
        <div className="w-full h-8 border border-border rounded-lg flex overflow-hidden">
          <div className="flex-1 bg-slate-50 flex items-center p-1.5 gap-1 border-r border-slate-100">
            <div className="h-2 w-4 bg-primary rounded" />
          </div>
          <div className="flex-1 bg-slate-900 flex items-center p-1.5 gap-1">
            <div className="h-2 w-4 bg-primary rounded" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isSelected = theme === opt.value;

        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setTheme(opt.value)}
            className={cn(
              "text-left p-4 rounded-2xl border transition-all flex flex-col justify-between h-36 relative group hover:border-primary/50",
              isSelected ? "border-primary ring-2 ring-primary/20 bg-muted/20" : "border-border bg-card"
            )}
          >
            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={cn("h-4 w-4", isSelected ? "text-primary" : "text-muted-foreground")} />
                  <span className="text-sm font-semibold">{opt.label}</span>
                </div>
                {isSelected && (
                  <span className="h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-snug pr-4">
                {opt.description}
              </p>
            </div>
            <div className="w-full mt-2">
              {opt.preview}
            </div>
          </button>
        );
      })}
    </div>
  );
}
