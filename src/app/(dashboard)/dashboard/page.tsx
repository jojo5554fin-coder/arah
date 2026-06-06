"use client";

import { useState, useEffect } from "react";
import { format, subDays, addDays } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus, Target, LayoutGrid } from "lucide-react";
import { AggregateGrid } from "@/components/dashboard/aggregate-grid";
import { GridThemeSelector, GridTheme } from "@/components/dashboard/grid-theme-selector";
import { TodaysHabits } from "@/components/dashboard/todays-habits";
import { categoryList } from "@/config/categories";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Link from "next/link";
import { ShareDialog } from "@/components/share/share-dialog";
import { AverageActivityPopup } from "@/components/dashboard/average-activity-popup";
import { GamificationWidget } from "@/components/gamification/gamification-widget";

interface Habit {
  id: string;
  name: string;
  category: string;
  frequency: string;
}

export default function DashboardPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  // Record of date strings "yyyy-MM-dd" to Set of habit_ids
  const [completions, setCompletions] = useState<Record<string, Set<string>>>({});
  const [isLoading, setIsLoading] = useState(true);

  const [gridTheme, setGridTheme] = useState<GridTheme>("emerald");

  // Show a rolling 140 day window ending today for the heatmap
  const endDate = new Date();
  const startDate = subDays(endDate, 140);

  const fetchGridData = async () => {
    setIsLoading(true);
    const supabase = createClient();
    
    const startStr = format(startDate, "yyyy-MM-dd");
    const endStr = format(endDate, "yyyy-MM-dd");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      // Fetch active habits
      const { data: activeHabits, error: habitsError } = await supabase
        .from("habits")
        .select("id, name, category, frequency")
        .eq("user_id", user.id)
        .eq("is_active", true);

      if (habitsError) throw habitsError;

      // Fetch completions for the interval
      const { data: rangeCompletions, error: compError } = await supabase
        .from("habit_completions")
        .select("habit_id, completed_date")
        .eq("user_id", user.id)
        .gte("completed_date", startStr)
        .lte("completed_date", endStr);

      if (compError) throw compError;

      setHabits(activeHabits || []);
      
      // Group completions by date
      const compsByDate: Record<string, Set<string>> = {};
      (rangeCompletions || []).forEach(c => {
        if (!compsByDate[c.completed_date]) compsByDate[c.completed_date] = new Set();
        compsByDate[c.completed_date].add(c.habit_id);
      });
      setCompletions(compsByDate);

    } catch (error: any) {
      if (process.env.NODE_ENV === "development") {
        // Mock Data for local dev
        setHabits([
          { id: "1", name: "Morning Meditation", category: "spiritual", frequency: "daily" },
          { id: "2", name: "Read 10 Pages", category: "education", frequency: "daily" },
          { id: "3", name: "Gym Workout", category: "fitness", frequency: "daily" },
          { id: "4", name: "Drink 2L Water", category: "health", frequency: "daily" },
        ]);
        
        // Mock some historical completions
        const mockComps: Record<string, Set<string>> = {};
        for(let i=0; i<=140; i++) {
          const d = format(subDays(endDate, i), "yyyy-MM-dd");
          const set = new Set<string>();
          if (Math.random() > 0.4) set.add("1");
          if (Math.random() > 0.6) set.add("2");
          if (Math.random() > 0.3) set.add("3");
          if (Math.random() > 0.2) set.add("4");
          mockComps[d] = set;
        }
        setCompletions(mockComps);
      } else {
        toast.error("Failed to load habit activity grid");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGridData();
  }, []);

  const handleToggleHabit = async (habitId: string, date: Date, currentlyCompleted: boolean) => {
    // When toggling from today's list, if they check it today, update UI optimistically
    const supabase = createClient();
    const dateStr = format(date, "yyyy-MM-dd");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      if (currentlyCompleted) {
        // Delete completion
        const { error } = await supabase
          .from("habit_completions")
          .delete()
          .match({ habit_id: habitId, user_id: user.id, completed_date: dateStr });
        if (error) throw error;
        
        setCompletions(prev => {
          const next = { ...prev };
          if (next[dateStr]) {
            const nextSet = new Set(next[dateStr]);
            nextSet.delete(habitId);
            next[dateStr] = nextSet;
          }
          return next;
        });
      } else {
        // Add completion
        const { error } = await supabase
          .from("habit_completions")
          .insert({
            habit_id: habitId,
            user_id: user.id,
            completed_date: dateStr,
          });
        if (error) throw error;

        setCompletions(prev => {
          const next = { ...prev };
          const nextSet = new Set(next[dateStr] || []);
          nextSet.add(habitId);
          next[dateStr] = nextSet;
          return next;
        });
      }
    } catch (error: any) {
      if (process.env.NODE_ENV === "development") {
        // Mock update
        setCompletions(prev => {
          const next = { ...prev };
          const nextSet = new Set(next[dateStr] || []);
          if (currentlyCompleted) nextSet.delete(habitId);
          else nextSet.add(habitId);
          next[dateStr] = nextSet;
          return next;
        });
      } else {
        toast.error(error.message);
        throw error;
      }
    }
  };

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayCompletions = completions[todayStr]?.size || 0;

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      <div className="page-header flex flex-col gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="page-title">Activity Grid</h2>
          <p className="page-subtitle">Your loggd.life style consistency trace</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <AverageActivityPopup />
          <ShareDialog 
            title="Daily Consistency"
            subtitle={`${format(new Date(), "MMM do, yyyy")}`}
            metrics={[
              { label: "Habits Today", value: `${todayCompletions}/${habits.length}` },
              { label: "Daily Momentum", value: habits.length > 0 ? `${Math.round((todayCompletions / habits.length) * 100)}%` : "0%" },
              { label: "Current Streak", value: "12 Days" }
            ]}
          />
          <Link href="/habits" className={buttonVariants({ size: "sm", className: "md:h-9 md:px-4" })}>
            <Plus className="mr-2 h-4 w-4" /> Manage
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 md:grid-cols-12">
        {/* Left Column: Activity Grid */}
        <div className="md:col-span-8 space-y-6">
          <Card className="border-primary/10 shadow-sm overflow-hidden">
            <CardHeader className="pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <LayoutGrid className="h-5 w-5 text-primary" /> 
                  Consistency Trace
                </CardTitle>
                <CardDescription>
                  Your loggd.life style activity heatmap.
                </CardDescription>
              </div>
              <GridThemeSelector currentTheme={gridTheme} onThemeChange={setGridTheme} />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-32 w-full bg-muted/50 rounded-xl animate-pulse" />
              ) : (
                <AggregateGrid 
                  habitsCount={habits.length}
                  completions={completions}
                  daysToShow={140}
                  theme={gridTheme}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Gamification & Insights */}
        <div className="md:col-span-4 space-y-6">
          <Card className="border-primary/10 shadow-sm overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" /> 
                Today's Habits
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2].map(i => (
                    <div key={i} className="h-12 w-full bg-muted/50 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <TodaysHabits 
                  habits={habits}
                  todayCompletions={completions[todayStr] || new Set()}
                  onToggleHabit={(id, isCompleted) => handleToggleHabit(id, new Date(), isCompleted)}
                />
              )}
            </CardContent>
          </Card>

          <GamificationWidget />
        </div>
      </div>
    </div>
  );
}
