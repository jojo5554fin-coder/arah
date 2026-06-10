"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, PauseCircle, PlayCircle, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HabitDialog } from "@/components/habits/habit-dialog";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format, subDays, isSameDay } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSubscription } from "@/hooks/useSubscription";
import { UpgradeBanner } from "@/components/monetization/upgrade-banner";
import { UpgradeModal } from "@/components/monetization/upgrade-modal";

interface Habit {
  id: string;
  name: string;
  category: string;
  frequency: string;
  reminder_time: string | null;
  is_active: boolean;
  color?: string | null;
}

interface HabitCompletion {
  id: string;
  habit_id: string;
  completed_at: string;
  completion_type: "full" | "partial";
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [timeRange, setTimeRange] = useState<"30" | "365">("30");
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [loggingHabitId, setLoggingHabitId] = useState<string | null>(null);
  const { isPro } = useSubscription();

  // Generate days based on selected range
  const daysLength = parseInt(timeRange);
  const days = Array.from({ length: daysLength }).map((_, i) => subDays(new Date(), daysLength - 1 - i));

  const fetchData = async () => {
    setIsLoading(true);
    const supabase = createClient();
    try {
      const { data: habitsData, error: habitsError } = await supabase
        .from("habits")
        .select("*")
        .order("created_at", { ascending: false });

      if (habitsError) throw habitsError;
      
      const { data: userAuth } = await supabase.auth.getUser();
      if (userAuth?.user) {
        // Limit query to last 365 days to be safe for both ranges
        const maxDaysAgo = subDays(new Date(), 365).toISOString();
        const { data: completionsData, error: compError } = await supabase
          .from("habit_completions")
          .select("*")
          .gte("completed_at", maxDaysAgo);
          
        if (compError) throw compError;
        setCompletions(completionsData || []);
      }
      
      setHabits(habitsData || []);
    } catch (error: any) {
      console.error(error);
      if (process.env.NODE_ENV === "development") {
        setHabits([
          { id: "1", name: "Morning Meditation", category: "spiritual", frequency: "daily", reminder_time: "07:00", is_active: true, color: "emerald" },
          { id: "2", name: "Read 10 Pages", category: "education", frequency: "daily", reminder_time: null, is_active: true, color: "indigo" },
          { id: "3", name: "Gym Workout", category: "fitness", frequency: "weekdays", reminder_time: "18:00", is_active: false, color: "rose" },
        ]);
        
        // Mock completions
        const mockComps: HabitCompletion[] = [];
        days.forEach(d => {
          if (Math.random() > 0.4) mockComps.push({ id: Math.random().toString(), habit_id: "1", completed_at: d.toISOString(), completion_type: "full" as const });
          if (Math.random() > 0.3) mockComps.push({ id: Math.random().toString(), habit_id: "2", completed_at: d.toISOString(), completion_type: Math.random() > 0.7 ? "partial" as const : "full" as const });
        });
        setCompletions(mockComps);
      } else {
        toast.error("Failed to load habits");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = () => {
    if (!isPro && habits.filter(h => h.is_active).length >= 3) {
      setUpgradeModalOpen(true);
      return;
    }
    setEditingHabit(null);
    setIsDialogOpen(true);
  };

  const handleLogCompletion = async (habitId: string, completionType: "full" | "partial") => {
    setLoggingHabitId(habitId);
    const supabase = createClient();
    const today = new Date().toISOString().split("T")[0];

    // Check if already logged today
    const existing = completions.find(
      c => c.habit_id === habitId && isSameDay(new Date(c.completed_at), new Date())
    );

    try {
      if (existing) {
        if (existing.completion_type === completionType) {
          // Un-log if same type tapped again
          const { error } = await supabase.from("habit_completions").delete().eq("id", existing.id);
          if (error) throw error;
          toast.success("Removed today's completion");
        } else {
          // Update to new type
          const { error } = await supabase.from("habit_completions")
            .update({ completion_type: completionType })
            .eq("id", existing.id);
          if (error) throw error;
          toast.success(completionType === "full" ? "Marked as fully complete!" : "Marked as partial");
        }
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        const { error } = await supabase.from("habit_completions").insert({
          habit_id: habitId,
          user_id: user?.id,
          completed_at: new Date().toISOString(),
          completion_type: completionType,
        });
        if (error) throw error;
        toast.success(completionType === "full" ? "✅ Habit complete!" : "⚡ Partial progress logged!");
      }
      await fetchData();
    } catch (err) {
      toast.error("Failed to log completion");
    } finally {
      setLoggingHabitId(null);
    }
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsDialogOpen(true);
  };

  const handleToggleActive = async (habit: Habit) => {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from("habits")
        .update({ is_active: !habit.is_active })
        .eq("id", habit.id);
        
      if (error) throw error;
      fetchData();
      toast.success(`Habit ${habit.is_active ? 'paused' : 'resumed'}`);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        setHabits(habits.map(h => h.id === habit.id ? { ...h, is_active: !h.is_active } : h));
        toast.info("Local mode: status toggled");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this habit? This cannot be undone.")) return;
    
    const supabase = createClient();
    try {
      const { error } = await supabase.from("habits").delete().eq("id", id);
      if (error) throw error;
      fetchData();
      toast.success("Habit deleted");
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        setHabits(habits.filter(h => h.id !== id));
        toast.info("Local mode: habit deleted");
      }
    }
  };

  const getHabitColor = (colorName: string | null | undefined) => {
    const map: Record<string, string> = {
      emerald: "bg-emerald-500",
      blue: "bg-blue-500",
      indigo: "bg-indigo-500",
      rose: "bg-rose-500",
      amber: "bg-amber-500",
    };
    return map[colorName || ""] || "bg-primary";
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="page-header flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="page-title">Your Habits</h2>
          <p className="page-subtitle">Detailed tracking traces for each habit.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as "30" | "365")} className="w-full sm:w-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="30">30 Days</TabsTrigger>
              <TabsTrigger value="365">This Year</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={handleCreate} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Create
          </Button>
        </div>
      </div>

      <HabitDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        habit={editingHabit} 
        onSuccess={fetchData} 
      />

      {/* Upgrade modal for free users hitting limit */}
      <UpgradeModal
        open={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        trigger="habits-limit"
      />

      {/* Contextual upgrade banner */}
      {!isPro && habits.length >= 2 && (
        <UpgradeBanner
          variant={habits.length >= 3 ? "habits-limit" : "habits-warning"}
        />
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="opacity-50 animate-pulse h-32"></Card>
          ))}
        </div>
      ) : habits.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-3xl bg-muted/10"
        >
          <div className="h-24 w-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center text-5xl mb-6 shadow-inner ring-1 ring-emerald-500/20">
            🌱
          </div>
          <h3 className="text-2xl font-bold tracking-tight mb-2">Plant Your First Seed</h3>
          <p className="text-muted-foreground max-w-[400px] mb-8">
            Great things start small. Build your momentum by adding a simple habit you can commit to daily.
          </p>
          <Button onClick={handleCreate} size="lg" className="h-12 px-8 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
            <Plus className="mr-2 h-5 w-5" /> Create a Habit
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {habits.map((habit) => {
            const habitComps = completions.filter(c => c.habit_id === habit.id);
            const colorClass = getHabitColor(habit.color);
            
            return (
              <Card key={habit.id} className={cn("transition-all duration-200 overflow-hidden", !habit.is_active && "opacity-60 grayscale-[0.5]")}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/20 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-3 h-3 rounded-full", colorClass)} />
                    <CardTitle className="text-lg">{habit.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    {/* Today's quick-log buttons */}
                    {habit.is_active && (() => {
                      const todayComp = habitComps.find(c => isSameDay(new Date(c.completed_at), new Date()));
                      return (
                        <>
                          <Button
                            variant={todayComp?.completion_type === "partial" ? "default" : "ghost"}
                            size="sm"
                            className={cn("h-7 px-2 text-xs gap-1", todayComp?.completion_type === "partial" && "opacity-80")}
                            onClick={() => handleLogCompletion(habit.id, "partial")}
                            disabled={loggingHabitId === habit.id}
                          >
                            ⚡ Partial
                          </Button>
                          <Button
                            variant={todayComp?.completion_type === "full" ? "default" : "ghost"}
                            size="sm"
                            className="h-7 px-2 text-xs gap-1"
                            onClick={() => handleLogCompletion(habit.id, "full")}
                            disabled={loggingHabitId === habit.id}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" /> Done
                          </Button>
                        </>
                      );
                    })()}
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(habit)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleToggleActive(habit)}>
                      {habit.is_active ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(habit.id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-4">
                  {/* Heatmap Trace */}
                  <div className="relative overflow-hidden">
                    <div 
                      className="flex gap-1.5 overflow-x-auto pb-4 custom-scrollbar snap-x"
                      // Reverse row order so scrolling starts at the right side (most recent) automatically
                      style={{ flexDirection: "row-reverse" }}
                    >
                      {[...days].reverse().map((date, i) => {
                        const comp = habitComps.find(c => isSameDay(new Date(c.completed_at), date));
                        const isCompleted = !!comp;
                        const isPartial = comp?.completion_type === "partial";
                        const isFull = comp?.completion_type === "full";
                        const isToday = isSameDay(date, new Date());
                        const isYearRange = timeRange === "365";
                        
                        return (
                          <div 
                            key={i} 
                            className="flex flex-col items-center gap-1 shrink-0 snap-start"
                            title={`${format(date, "MMM d, yyyy")}${isPartial ? " — Partial" : isFull ? " — Complete" : ""}`}
                          >
                            <motion.div 
                              initial={false}
                              animate={{ scale: isCompleted ? 1 : 0.9 }}
                              className={cn(
                                "rounded-md transition-all flex items-center justify-center",
                                isYearRange ? "w-4 h-4" : "w-6 h-6",
                                isFull && colorClass,
                                isPartial && `${colorClass} opacity-50 border-2 border-dashed`,
                                !isCompleted && "bg-muted hover:bg-muted/80",
                                isToday && "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                              )}
                            >
                              {isFull && !isYearRange && <CheckCircle2 className="h-3 w-3 text-white opacity-90" />}
                              {isPartial && !isYearRange && <span className="text-[8px] text-white font-bold leading-none">½</span>}
                            </motion.div>
                            {(date.getDate() === 1 || isToday) ? (
                              <span className={cn("text-[10px] font-medium whitespace-nowrap", isToday ? "text-foreground" : "text-muted-foreground", isYearRange && "text-[8px] tracking-tighter")}>
                                {isToday ? 'Today' : format(date, "MMM")}
                              </span>
                            ) : (
                              <span className="text-[10px] text-transparent select-none">-</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <span className="capitalize text-xs font-medium">{habit.frequency}</span>
                    {habit.reminder_time && (
                      <>
                        <span>•</span>
                        <span className="text-xs">{habit.reminder_time}</span>
                      </>
                    )}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
