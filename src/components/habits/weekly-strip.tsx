"use client";

import { useState } from "react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

interface WeeklyStripProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function WeeklyStrip({ selectedDate, onSelectDate }: WeeklyStripProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));

  return (
    <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {weekDays.map((date) => {
        const isSelected = isSameDay(date, selectedDate);
        const isToday = isSameDay(date, new Date());
        
        return (
          <button
            key={date.toISOString()}
            onClick={() => onSelectDate(date)}
            className={cn(
              "flex min-w-[3rem] flex-col items-center justify-center rounded-xl p-2 transition-all",
              isSelected 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "bg-card hover:bg-muted text-muted-foreground",
              isToday && !isSelected && "border-2 border-primary/50 text-foreground"
            )}
          >
            <span className="text-xs font-medium uppercase tracking-wider mb-1">
              {format(date, "EEE")}
            </span>
            <span className={cn(
              "text-lg font-bold", 
              isSelected ? "text-primary-foreground" : "text-foreground"
            )}>
              {format(date, "d")}
            </span>
            {/* Optional dot indicator if all habits are completed that day */}
            {/* <span className="mt-1 h-1 w-1 rounded-full bg-current opacity-50" /> */}
          </button>
        );
      })}
    </div>
  );
}
