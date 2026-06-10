"use client";

import { motion } from "framer-motion";
import { Check, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface Habit {
  id: string;
  name: string;
  category: string;
}

interface TodaysHabitsProps {
  habits: Habit[];
  todayCompletions: Set<string>;
  onToggleHabit: (habitId: string, isCompleted: boolean) => void;
  onReflectMissed?: (habitId: string, habitName: string) => void;
}

export function TodaysHabits({ habits, todayCompletions, onToggleHabit, onReflectMissed }: TodaysHabitsProps) {
  if (habits.length === 0) {
    return (
      <div className="text-center py-6 text-sm text-muted-foreground border border-dashed rounded-xl bg-muted/10">
        No habits active for today. Let's add some!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {habits.map((habit) => {
        const isCompleted = todayCompletions.has(habit.id);

        return (
          <div 
            key={habit.id} 
            className="flex items-center justify-between p-3 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex flex-col">
              <span className={cn(
                "font-medium text-sm transition-colors",
                isCompleted ? "text-muted-foreground line-through" : "text-foreground"
              )}>
                {habit.name}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                {habit.category}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {!isCompleted && onReflectMissed && (
                <button
                  type="button"
                  onClick={() => onReflectMissed(habit.id, habit.name)}
                  className="w-8 h-8 rounded-sm border-2 border-foreground bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all shadow-[2px_2px_0px_0px_var(--foreground)] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_var(--foreground)] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_var(--foreground)]"
                  title="Reflect on missing"
                >
                  <Brain className="h-4 w-4" />
                </button>
              )}

              <button
                onClick={(e) => {
                  if (!isCompleted) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = (rect.left + rect.width / 2) / window.innerWidth;
                    const y = (rect.top + rect.height / 2) / window.innerHeight;
                    confetti({
                      particleCount: 40,
                      spread: 50,
                      origin: { x, y },
                      colors: ["#3b82f6", "#10b981", "#6366f1"],
                      disableForReducedMotion: true,
                      zIndex: 100,
                    });
                  }
                  onToggleHabit(habit.id, isCompleted);
                }}
                className={cn(
                  "w-8 h-8 rounded-sm flex items-center justify-center transition-all outline-none border-2 border-foreground shadow-[2px_2px_0px_0px_var(--foreground)] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_var(--foreground)] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_var(--foreground)]",
                  isCompleted 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-card hover:bg-muted"
                )}
                aria-label={`Toggle ${habit.name}`}
              >
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Check className="h-4 w-4" />
                  </motion.div>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
