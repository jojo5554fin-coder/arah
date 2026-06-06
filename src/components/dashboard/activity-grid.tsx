"use client";

import { useState } from "react";
import { format, addDays, subDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Habit {
  id: string;
  name: string;
  category: string;
}

interface ActivityGridProps {
  habits: Habit[];
  completions: Record<string, Set<string>>; // Map of date string "yyyy-MM-dd" to Set of habit_ids
  onToggleHabit: (habitId: string, date: Date, isCompleted: boolean) => void;
  startDate: Date;
  endDate: Date;
}

export function ActivityGrid({ habits, completions, onToggleHabit, startDate, endDate }: ActivityGridProps) {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const today = new Date();

  // Helper to check if a habit is completed on a specific day
  const isCompleted = (habitId: string, date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return completions[dateStr]?.has(habitId) || false;
  };

  return (
    <div className="w-full overflow-x-auto pb-6 custom-scrollbar">
      <div className="min-w-max">
        {/* Header Row: Dates */}
        <div className="flex mb-4">
          <div className="w-32 md:w-48 shrink-0" /> {/* Spacer for habit names */}
          <div className="flex gap-1 md:gap-2">
            {days.map((day, i) => (
              <div 
                key={i} 
                className={cn(
                  "flex flex-col items-center justify-end w-8 md:w-10 shrink-0",
                  isSameDay(day, today) ? "text-primary font-bold" : "text-muted-foreground"
                )}
              >
                <span className="text-[10px] uppercase">{format(day, "EEE")}</span>
                <span className="text-sm">{format(day, "d")}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Habit Rows */}
        <div className="space-y-3">
          {habits.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border border-dashed rounded-xl">
              No habits found. Add one to start tracking!
            </div>
          ) : (
            habits.map((habit) => (
              <div key={habit.id} className="flex items-center group">
                {/* Habit Name */}
                <div className="w-32 md:w-48 shrink-0 pr-2 md:pr-4 flex items-center justify-between">
                  <span className="text-xs md:text-sm font-medium truncate" title={habit.name}>
                    {habit.name}
                  </span>
                </div>
                
                {/* Grid Cells (Cinema Seats) */}
                <div className="flex gap-1 md:gap-2">
                  {days.map((day, i) => {
                    const completed = isCompleted(habit.id, day);
                    const isFuture = day > today && !isSameDay(day, today);
                    
                    return (
                      <motion.button
                        key={i}
                        whileHover={!isFuture ? { scale: 1.15 } : {}}
                        whileTap={!isFuture ? { scale: 0.9 } : {}}
                        onClick={() => !isFuture && onToggleHabit(habit.id, day, completed)}
                        disabled={isFuture}
                        className={cn(
                          "w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center transition-colors relative outline-none",
                          // Styling the "seat"
                          completed 
                            ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20" 
                            : isFuture 
                              ? "border-2 border-dashed border-muted/50 opacity-50 cursor-not-allowed"
                              : "border-2 border-muted hover:border-primary/50 hover:bg-muted/30"
                        )}
                        aria-label={`Toggle ${habit.name} on ${format(day, "MMM d")}`}
                      >
                        {completed && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <Check className="h-4 w-4 md:h-5 md:w-5" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
