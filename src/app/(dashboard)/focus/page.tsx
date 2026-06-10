"use client";

import { useState, useEffect } from "react";
import { FocusTimer } from "@/components/focus/focus-timer";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Timer, Target, Unlink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

interface Habit {
  id: string;
  name: string;
  category: string;
  color?: string | null;
}

export default function FocusPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [linkedHabitId, setLinkedHabitId] = useState<string>("");

  useEffect(() => {
    const fetchHabits = async () => {
      const supabase = createClient();
      try {
        const { data } = await supabase
          .from("habits")
          .select("id, name, category, color")
          .eq("is_active", true)
          .order("name");
        setHabits(data || []);
      } catch {
        // dev fallback
        setHabits([
          { id: "1", name: "Morning Meditation", category: "spiritual", color: "emerald" },
          { id: "2", name: "Deep Work", category: "career", color: "indigo" },
          { id: "3", name: "Read 10 Pages", category: "education", color: "blue" },
        ]);
      }
    };
    fetchHabits();
  }, []);

  const linkedHabit = habits.find(h => h.id === linkedHabitId) ?? null;

  const handleHabitComplete = async (habitId: string) => {
    const supabase = createClient();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("habit_completions").insert({
        habit_id: habitId,
        user_id: user?.id,
        completed_at: new Date().toISOString(),
        completion_type: "full",
      });
      toast.success("✅ Habit marked complete!", { description: "Great focus session!" });
    } catch {
      toast.info("Focus session recorded!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title flex items-center gap-2">
            <Timer className="h-8 w-8 text-primary" />
            Focus Timer
          </h2>
          <p className="page-subtitle">
            Work in focused sprints. Link a habit to mark it complete when you're done.
          </p>
        </div>
      </div>

      {/* Habit link selector */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 p-4 bg-card rounded-2xl border"
      >
        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Target className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">Linked Habit</p>
          <p className="text-xs text-muted-foreground">Complete when session ends</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={linkedHabitId} onValueChange={(v) => setLinkedHabitId(v ?? "")}>
            <SelectTrigger className="w-[180px] h-9 rounded-xl text-xs">
              <SelectValue placeholder="Select habit…" />
            </SelectTrigger>
            <SelectContent>
              {habits.map(h => (
                <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {linkedHabitId && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl text-muted-foreground"
              onClick={() => setLinkedHabitId("")}
            >
              <Unlink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </motion.div>

      {/* Timer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-3xl border p-8 md:p-12 flex flex-col items-center"
      >
        <FocusTimer
          linkedHabit={linkedHabit}
          onHabitComplete={handleHabitComplete}
        />
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {[
          { emoji: "🎯", title: "25 min focus", desc: "Work on one thing only — no switching" },
          { emoji: "☕", title: "5 min break", desc: "Step away. Stretch, breathe, hydrate" },
          { emoji: "🔁", title: "4 sessions", desc: "Then take a long 15-min break" },
        ].map((tip, i) => (
          <div key={i} className="p-4 rounded-2xl bg-muted/30 border">
            <div className="text-2xl mb-2">{tip.emoji}</div>
            <p className="font-semibold text-sm">{tip.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{tip.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
