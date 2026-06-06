"use client";

import { useMemo } from "react";
import { format, eachDayOfInterval, subDays, isSameDay, getDay } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { GridTheme, GRID_THEMES } from "./grid-theme-selector";

interface AggregateGridProps {
  habitsCount: number;
  completions: Record<string, Set<string>>; // Map of date string "yyyy-MM-dd" to Set of habit_ids
  daysToShow?: number;
  theme: GridTheme;
}

export function AggregateGrid({ habitsCount, completions, daysToShow = 140, theme }: AggregateGridProps) {
  // Generate days for the grid
  const today = new Date();
  const endDate = today;
  const startDate = subDays(endDate, daysToShow - 1);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const themeColors = GRID_THEMES[theme].colors;

  // We want to arrange days into columns of 7 (Sunday - Saturday)
  // First, pad the beginning so the first column starts on a Sunday.
  const startDayOfWeek = getDay(startDate); // 0 = Sunday, 1 = Monday...
  
  // Create an array of nulls for padding the first week
  const paddingDays = Array.from({ length: startDayOfWeek }).fill(null) as null[];
  const allCells = [...paddingDays, ...days];

  // Group cells into columns (weeks)
  const columns: (Date | null)[][] = [];
  for (let i = 0; i < allCells.length; i += 7) {
    columns.push(allCells.slice(i, i + 7));
  }

  // Calculate intensity for a given day (0 to 4 scale)
  const getIntensity = (date: Date) => {
    if (habitsCount === 0) return 0;
    const dateStr = format(date, "yyyy-MM-dd");
    const completedCount = completions[dateStr]?.size || 0;
    
    if (completedCount === 0) return 0;
    const percentage = completedCount / habitsCount;
    
    if (percentage <= 0.25) return 1;
    if (percentage <= 0.5) return 2;
    if (percentage <= 0.75) return 3;
    return 4; // 100% or close to it
  };

  return (
    <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
      <div className="min-w-max flex gap-1">
        {/* Day of week labels */}
        <div className="flex flex-col gap-1 pr-2 text-[10px] text-muted-foreground font-medium pt-[14px]">
          <div className="h-3 flex items-center"></div> {/* Sun */}
          <div className="h-3 flex items-center">Mon</div>
          <div className="h-3 flex items-center"></div> {/* Tue */}
          <div className="h-3 flex items-center">Wed</div>
          <div className="h-3 flex items-center"></div> {/* Thu */}
          <div className="h-3 flex items-center">Fri</div>
          <div className="h-3 flex items-center"></div> {/* Sat */}
        </div>

        <TooltipProvider delay={100}>
          {columns.map((col, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-1">
              {/* Optional: Month Label above the first column that hits the 1st of a month */}
              <div className="h-3 text-[10px] text-muted-foreground font-medium mb-0.5">
                {col.find(d => d && d.getDate() === 1) ? format(col.find(d => d && d.getDate() === 1)!, "MMM") : ""}
              </div>

              {col.map((day, rowIndex) => {
                if (!day) {
                  return <div key={`empty-${rowIndex}`} className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-sm bg-transparent" />;
                }

                const intensity = getIntensity(day);
                const colorClass = themeColors[intensity];
                const dateStr = format(day, "yyyy-MM-dd");
                const completedCount = completions[dateStr]?.size || 0;
                const isToday = isSameDay(day, today);

                return (
                  <Tooltip key={dateStr}>
                    <TooltipTrigger 
                      render={
                        <div 
                          className={cn(
                            "w-3 h-3 md:w-3.5 md:h-3.5 rounded-sm transition-colors duration-300 outline-none",
                            colorClass,
                            isToday && intensity === 0 ? "border border-primary/50" : "",
                            isToday ? "ring-1 ring-offset-1 ring-foreground/20" : ""
                          )}
                        />
                      }
                    />
                    <TooltipContent>
                      <p className="font-semibold text-sm">{format(day, "MMM do, yyyy")}</p>
                      <p className="text-xs text-muted-foreground">{completedCount} of {habitsCount} habits completed</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </TooltipProvider>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4 text-[10px] text-muted-foreground font-medium">
        <span>Less</span>
        <div className="flex gap-1">
          {themeColors.map((color, i) => (
            <div key={i} className={cn("w-3 h-3 rounded-sm", color)} />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
