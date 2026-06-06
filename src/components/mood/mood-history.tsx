"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { moodDimensions, type MoodEntry } from "@/config/mood";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MoodHistoryProps {
  entries: MoodEntry[];
}

function MoodBadge({ value, maxValue = 10 }: { value: number; maxValue?: number }) {
  const percent = (value / maxValue) * 100;
  let color = "bg-red-500/20 text-red-600 dark:text-red-400";
  if (percent >= 70) color = "bg-green-500/20 text-green-600 dark:text-green-400";
  else if (percent >= 40) color = "bg-amber-500/20 text-amber-600 dark:text-amber-400";

  return (
    <span className={cn("inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-bold tabular-nums min-w-[2rem]", color)}>
      {value}
    </span>
  );
}

function TrendIcon({ current, previous }: { current: number; previous: number }) {
  if (current > previous) return <TrendingUp className="h-3 w-3 text-green-500" />;
  if (current < previous) return <TrendingDown className="h-3 w-3 text-red-500" />;
  return <Minus className="h-3 w-3 text-muted-foreground" />;
}

export function MoodHistory({ entries }: MoodHistoryProps) {
  if (entries.length === 0) {
    return (
      <div className="empty-state">
        <div className="text-4xl mb-4">📊</div>
        <h3 className="text-lg font-semibold">No mood history yet</h3>
        <p className="text-muted-foreground">Log your first mood entry to start seeing trends.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recent Entries</h3>
      <div className="space-y-3">
        {entries.map((entry, i) => {
          const prev = entries[i + 1]; // Previous entry (entries are newest-first)
          return (
            <Card key={entry.id} className="transition-all duration-200 hover:shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4 sm:px-6">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {format(new Date(entry.created_at), "EEEE, MMM d · h:mm a")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4 px-4 sm:px-6">
                {/* Mobile: Vertical stack, Desktop: Horizontal row */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
                  {moodDimensions.map((dim) => {
                    const val = entry[dim.key as keyof MoodEntry] as number;
                    const prevVal = prev ? (prev[dim.key as keyof MoodEntry] as number) : val;
                    return (
                      <div key={dim.key} className="flex items-center gap-2 sm:flex-col sm:items-center sm:text-center">
                        <span className="text-base sm:text-lg">{dim.icon}</span>
                        <div className="flex items-center gap-1 sm:flex-col sm:gap-0.5">
                          <MoodBadge value={val} />
                          {prev && (
                            <div className="flex items-center">
                              <TrendIcon current={val} previous={prevVal} />
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground hidden sm:block">{dim.label}</span>
                      </div>
                    );
                  })}
                </div>
                {entry.notes && (
                  <p className="mt-3 text-sm text-muted-foreground border-t border-border/40 pt-3 italic">
                    "{entry.notes}"
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
