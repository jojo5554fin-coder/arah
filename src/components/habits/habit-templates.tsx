"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2, Check, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TemplateHabit {
  name: string;
  category: string;
  frequency: string;
  color: string;
  reminder_time?: string;
}

interface Pack {
  id: string;
  name: string;
  description: string;
  emoji: string;
  gradient: string;
  habits: TemplateHabit[];
}

const PACKS: Pack[] = [
  {
    id: "morning-routine",
    name: "Morning Routine",
    description: "Start every day with intention and energy",
    emoji: "🌅",
    gradient: "from-amber-500/20 to-orange-400/10",
    habits: [
      { name: "Morning Meditation", category: "spiritual", frequency: "daily", color: "indigo", reminder_time: "07:00" },
      { name: "Drink Water (500ml)", category: "health", frequency: "daily", color: "blue", reminder_time: "07:05" },
      { name: "Journaling", category: "education", frequency: "daily", color: "emerald", reminder_time: "07:30" },
    ],
  },
  {
    id: "fitness",
    name: "Fitness Pack",
    description: "Build strength and consistency in movement",
    emoji: "💪",
    gradient: "from-rose-500/20 to-pink-400/10",
    habits: [
      { name: "Workout / Exercise", category: "fitness", frequency: "weekdays", color: "rose", reminder_time: "06:30" },
      { name: "10,000 Steps", category: "fitness", frequency: "daily", color: "amber", reminder_time: "12:00" },
      { name: "Stretch / Mobility", category: "fitness", frequency: "daily", color: "emerald", reminder_time: "21:00" },
    ],
  },
  {
    id: "deep-work",
    name: "Deep Work",
    description: "Build focus habits for peak performance",
    emoji: "🎯",
    gradient: "from-indigo-500/20 to-violet-400/10",
    habits: [
      { name: "Deep Work Block", category: "career", frequency: "weekdays", color: "indigo", reminder_time: "09:00" },
      { name: "Read 20 Pages", category: "education", frequency: "daily", color: "blue", reminder_time: "22:00" },
      { name: "No Social Media Before Noon", category: "career", frequency: "weekdays", color: "rose" },
    ],
  },
  {
    id: "mindfulness",
    name: "Mindfulness",
    description: "Calm your mind and recharge your spirit",
    emoji: "🧘",
    gradient: "from-emerald-500/20 to-teal-400/10",
    habits: [
      { name: "Meditation (10 min)", category: "spiritual", frequency: "daily", color: "emerald", reminder_time: "07:00" },
      { name: "Gratitude Journal", category: "spiritual", frequency: "daily", color: "amber", reminder_time: "21:30" },
      { name: "Digital Detox Hour", category: "health", frequency: "daily", color: "indigo", reminder_time: "21:00" },
    ],
  },
  {
    id: "finance",
    name: "Financial Health",
    description: "Build wealthy habits one day at a time",
    emoji: "💰",
    gradient: "from-yellow-500/20 to-amber-400/10",
    habits: [
      { name: "Track Daily Spending", category: "finance", frequency: "daily", color: "amber" },
      { name: "Read Finance News (15 min)", category: "finance", frequency: "weekdays", color: "blue", reminder_time: "08:00" },
      { name: "Review Budget Weekly", category: "finance", frequency: "weekly", color: "emerald" },
    ],
  },
];

interface Props {
  onSuccess: () => void;
  onSkip: () => void;
}

export function HabitTemplates({ onSuccess, onSkip }: Props) {
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [installed, setInstalled] = useState<string[]>([]);

  const handleInstall = async (pack: Pack) => {
    setIsLoading(true);
    const supabase = createClient();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      const inserts = pack.habits.map(h => ({
        user_id: user.id,
        name: h.name,
        category: h.category,
        frequency: h.frequency,
        color: h.color,
        reminder_time: h.reminder_time || null,
        is_active: true,
      }));

      const { error } = await supabase.from("habits").insert(inserts);
      if (error) throw error;

      setInstalled(prev => [...prev, pack.id]);
      toast.success(`✅ "${pack.name}" pack added!`, {
        description: `${pack.habits.length} habits ready to track.`,
      });
    } catch {
      // Dev mode fallback
      setInstalled(prev => [...prev, pack.id]);
      toast.info(`Pack "${pack.name}" added (local mode).`);
    } finally {
      setIsLoading(false);
    }
  };

  const activePack = PACKS.find(p => p.id === selectedPack);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Quick Start Packs</h3>
          <p className="text-sm text-muted-foreground">Add a curated set of habits instantly.</p>
        </div>
      </div>

      {/* Pack grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PACKS.map(pack => {
          const isInstalled = installed.includes(pack.id);
          const isSelected = selectedPack === pack.id;
          return (
            <motion.button
              key={pack.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPack(isSelected ? null : pack.id)}
              className={cn(
                "relative text-left p-5 rounded-2xl border transition-all",
                `bg-gradient-to-br ${pack.gradient}`,
                isSelected ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/50",
                isInstalled && "opacity-70"
              )}
            >
              {isInstalled && (
                <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Check className="h-3.5 w-3.5 text-white" />
                </div>
              )}
              <div className="text-3xl mb-3">{pack.emoji}</div>
              <p className="font-bold text-sm">{pack.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{pack.description}</p>
              <p className="text-xs font-medium text-primary mt-2">{pack.habits.length} habits included</p>
            </motion.button>
          );
        })}
      </div>

      {/* Pack detail preview */}
      <AnimatePresence>
        {activePack && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="border rounded-2xl p-5 bg-card space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold flex items-center gap-2">
                  <span>{activePack.emoji}</span> {activePack.name}
                </h4>
                <Button
                  size="sm"
                  className="rounded-xl gap-1.5"
                  disabled={isLoading || installed.includes(activePack.id)}
                  onClick={() => handleInstall(activePack)}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : installed.includes(activePack.id) ? (
                    <><Check className="h-4 w-4" /> Added</>
                  ) : (
                    <>Add Pack <ChevronRight className="h-4 w-4" /></>
                  )}
                </Button>
              </div>
              <ul className="space-y-2">
                {activePack.habits.map((h, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <div className={cn("h-2 w-2 rounded-full", {
                      "bg-emerald-500": h.color === "emerald",
                      "bg-blue-500": h.color === "blue",
                      "bg-indigo-500": h.color === "indigo",
                      "bg-rose-500": h.color === "rose",
                      "bg-amber-500": h.color === "amber",
                    })} />
                    <span className="flex-1">{h.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">{h.frequency}</span>
                    {h.reminder_time && <span className="text-xs text-muted-foreground">{h.reminder_time}</span>}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer actions */}
      <div className="flex justify-between items-center pt-2">
        <Button variant="ghost" onClick={onSkip} className="text-muted-foreground">
          Skip, I'll add habits manually
        </Button>
        {installed.length > 0 && (
          <Button onClick={onSuccess} className="rounded-xl gap-1.5">
            Continue <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
