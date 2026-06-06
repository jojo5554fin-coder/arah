"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { moodDimensions, type MoodEntry } from "@/config/mood";
import { cn } from "@/lib/utils";

interface MoodAveragesProps {
  entries: MoodEntry[];
}

export function MoodAverages({ entries }: MoodAveragesProps) {
  if (entries.length === 0) return null;

  const averages = moodDimensions.map((dim) => {
    const sum = entries.reduce((acc, entry) => acc + (entry[dim.key as keyof MoodEntry] as number), 0);
    return {
      ...dim,
      avg: Math.round((sum / entries.length) * 10) / 10,
    };
  });

  return (
    <Card className="border-primary/10 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">7-Day Averages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {averages.map((dim) => {
            const fillPercent = (dim.avg / 10) * 100;
            return (
              <div key={dim.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span>{dim.icon}</span>
                    <span className="font-medium">{dim.label}</span>
                  </div>
                  <span className={cn("font-bold tabular-nums", dim.color)}>{dim.avg}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700 ease-out", dim.sliderColor)}
                    style={{ width: `${fillPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
