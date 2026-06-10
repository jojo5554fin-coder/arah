"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Brain, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Completion {
  habit_id: string;
  completed_at: string;
  completion_type?: "full" | "partial";
}

interface MoodEntry {
  logged_at: string;
  stress: number;
  happiness: number;
  focus: number;
  energy: number;
  motivation: number;
}

interface Habit {
  id: string;
  name: string;
  color?: string | null;
}

interface Props {
  habits: Habit[];
  completions: Completion[];
  moodEntries: MoodEntry[];
}

const MOOD_DIMENSIONS = ["happiness", "focus", "energy", "motivation"] as const;
type MoodDimension = typeof MOOD_DIMENSIONS[number];

const moodLabels: Record<MoodDimension, string> = {
  happiness: "Happiness",
  focus: "Focus",
  energy: "Energy",
  motivation: "Motivation",
};

const moodEmojis: Record<MoodDimension, string> = {
  happiness: "😊",
  focus: "🎯",
  energy: "⚡",
  motivation: "🔥",
};

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function MoodHabitCorrelationCard({ habits, completions, moodEntries }: Props) {
  const correlations = useMemo(() => {
    if (habits.length === 0 || moodEntries.length === 0) return [];

    return habits.slice(0, 4).map((habit) => {
      const daysWithHabit: MoodEntry[] = [];
      const daysWithoutHabit: MoodEntry[] = [];

      moodEntries.forEach((entry) => {
        const entryDate = new Date(entry.logged_at);
        const didHabit = completions.some(
          (c) =>
            c.habit_id === habit.id &&
            isSameDay(new Date(c.completed_at), entryDate) &&
            c.completion_type !== "partial"
        );
        if (didHabit) daysWithHabit.push(entry);
        else daysWithoutHabit.push(entry);
      });

      if (daysWithHabit.length < 2 || daysWithoutHabit.length < 2) return null;

      const avg = (entries: MoodEntry[], dim: MoodDimension) =>
        entries.reduce((s, e) => s + e[dim], 0) / entries.length;

      const bestDim = MOOD_DIMENSIONS.reduce<{ dim: MoodDimension; delta: number }>(
        (best, dim) => {
          const delta = avg(daysWithHabit, dim) - avg(daysWithoutHabit, dim);
          return Math.abs(delta) > Math.abs(best.delta) ? { dim, delta } : best;
        },
        { dim: "happiness", delta: 0 }
      );

      return {
        habit,
        dim: bestDim.dim,
        delta: bestDim.delta,
        withAvg: avg(daysWithHabit, bestDim.dim),
        withoutAvg: avg(daysWithoutHabit, bestDim.dim),
        daysTracked: daysWithHabit.length,
      };
    }).filter(Boolean) as NonNullable<ReturnType<typeof habits.slice>["map"]> extends Array<infer T> ? T[] : never;
  }, [habits, completions, moodEntries]);

  if (correlations.length === 0) {
    return (
      <Card className="border-primary/10 bg-gradient-to-br from-violet-500/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Brain className="h-5 w-5 text-violet-500" />
            Mood-Habit Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Keep logging your habits and mood for at least 5 days to unlock behavioral pattern insights. 🧠
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/10 bg-gradient-to-br from-violet-500/5 to-transparent overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Brain className="h-5 w-5 text-violet-500" />
          Mood-Habit Patterns
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          How your habits actually affect your mood — based on your data.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {correlations.map((item: any, i: number) => {
          const isPositive = item.delta > 0;
          const isNeutral = Math.abs(item.delta) < 0.3;

          return (
            <motion.div
              key={item.habit.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-background/60 border p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm truncate max-w-[60%]">{item.habit.name}</p>
                <span className="text-xs text-muted-foreground">{item.daysTracked} days tracked</span>
              </div>

              {/* The insight sentence */}
              <div className={`flex items-start gap-2 rounded-xl p-3 ${
                isNeutral ? "bg-muted/40" : isPositive ? "bg-emerald-500/10" : "bg-rose-500/10"
              }`}>
                {isNeutral
                  ? <Minus className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                  : isPositive
                  ? <TrendingUp className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600" />
                  : <TrendingDown className="h-4 w-4 mt-0.5 shrink-0 text-rose-500" />
                }
                <p className={`text-xs leading-relaxed font-medium ${
                  isNeutral ? "text-muted-foreground" : isPositive ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"
                }`}>
                  {isNeutral
                    ? `No strong mood pattern detected for this habit yet.`
                    : `On days you complete this, your ${moodLabels[item.dim as MoodDimension]} ${moodEmojis[item.dim as MoodDimension]} averages `}
                  {!isNeutral && (
                    <strong>
                      {item.withAvg.toFixed(1)} vs {item.withoutAvg.toFixed(1)}
                    </strong>
                  )}
                  {!isNeutral && ` on days you skip it — a ${Math.abs(item.delta).toFixed(1)} point ${isPositive ? "boost" : "drop"}.`}
                </p>
              </div>

              {/* Bar comparison */}
              {!isNeutral && (
                <div className="space-y-1.5">
                  {[
                    { label: "With habit", value: item.withAvg, color: isPositive ? "bg-emerald-500" : "bg-rose-400" },
                    { label: "Without habit", value: item.withoutAvg, color: "bg-muted-foreground/30" },
                  ].map((bar) => (
                    <div key={bar.label} className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground w-20 shrink-0">{bar.label}</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(bar.value / 10) * 100}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.1 + 0.3 }}
                          className={`h-full rounded-full ${bar.color}`}
                        />
                      </div>
                      <span className="text-[10px] font-bold w-6 text-right">{bar.value.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}

        <p className="text-[10px] text-muted-foreground text-center pt-1">
          Based on the last 30 days of your mood and habit data.
        </p>
      </CardContent>
    </Card>
  );
}
