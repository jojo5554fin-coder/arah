"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface HabitTrackerItemProps {
  id: string;
  name: string;
  category: string;
  icon: string;
  isCompleted: boolean;
  onToggle: (id: string, currentlyCompleted: boolean) => Promise<void>;
}

export function HabitTrackerItem({ id, name, category, icon, isCompleted, onToggle }: HabitTrackerItemProps) {
  const [isLoading, setIsLoading] = useState(false);
  // Optimistic UI state
  const [optimisticCompleted, setOptimisticCompleted] = useState(isCompleted);

  // Update optimistic state if prop changes (due to date change or real fetch)
  useEffect(() => {
    setOptimisticCompleted(isCompleted);
  }, [isCompleted]);

  const handleToggle = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    const newState = !optimisticCompleted;
    setOptimisticCompleted(newState); // optimistic update

    if (newState) {
      // Trigger confetti on completion
      const rect = document.getElementById(`habit-btn-${id}`)?.getBoundingClientRect();
      if (rect) {
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { x, y },
          colors: ['#4f46e5', '#14b8a6', '#f59e0b'],
          disableForReducedMotion: true,
          zIndex: 100,
        });
      }
    }

    try {
      await onToggle(id, !newState); // passing old state
    } catch (err) {
      // revert if failed
      setOptimisticCompleted(!newState);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={cn(
        "group relative flex items-center justify-between p-4 rounded-xl border bg-card transition-all duration-300",
        optimisticCompleted ? "border-primary/50 bg-primary/5 shadow-sm" : "hover:border-primary/30 shadow-sm"
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
          optimisticCompleted ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground group-hover:text-primary"
        )}>
          <span className="text-xl">{icon}</span>
        </div>
        <div>
          <h4 className={cn(
            "font-semibold transition-all",
            optimisticCompleted ? "text-primary" : "text-foreground"
          )}>
            {name}
          </h4>
          <p className="text-xs text-muted-foreground capitalize">{category}</p>
        </div>
      </div>

      <button
        id={`habit-btn-${id}`}
        onClick={handleToggle}
        disabled={isLoading}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all active:scale-95",
          optimisticCompleted 
            ? "bg-primary border-primary text-primary-foreground" 
            : "border-muted-foreground/30 bg-transparent hover:border-primary",
          isLoading && "opacity-70 pointer-events-none"
        )}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <Check className={cn("h-4 w-4 transition-all duration-300", optimisticCompleted ? "scale-100 opacity-100" : "scale-50 opacity-0")} />
        )}
      </button>
    </div>
  );
}
