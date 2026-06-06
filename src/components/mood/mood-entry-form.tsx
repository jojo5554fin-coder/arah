"use client";

import { useState } from "react";
import { VolumeDial } from "./volume-dial";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { moodDimensions, type MoodDimensionKey } from "@/config/mood";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

interface MoodEntryFormProps {
  onSuccess: () => void;
}

export function MoodEntryForm({ onSuccess }: MoodEntryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [activeTab, setActiveTab] = useState<MoodDimensionKey>("stress");
  const [values, setValues] = useState<Record<MoodDimensionKey, number>>({
    stress: 5,
    happiness: 5,
    focus: 5,
    energy: 5,
    motivation: 5,
  });

  const activeIndex = moodDimensions.findIndex(d => d.key === activeTab);
  const activeDimension = moodDimensions[activeIndex];

  const updateValue = (key: MoodDimensionKey, val: number) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const getEmoji = (value: number): string => {
    if (value <= 2) return "😔";
    if (value <= 4) return "😐";
    if (value <= 6) return "🙂";
    if (value <= 8) return "😊";
    return "🤩";
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("mood_entries").insert({
        user_id: user.id,
        ...values,
        notes: notes || null,
      });

      if (error) throw error;

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ["#f59e0b", "#14b8a6", "#8b5cf6"],
        disableForReducedMotion: true,
      });

      toast.success("Mood logged! Keep tracking your journey 💪");
      setValues({ stress: 5, happiness: 5, focus: 5, energy: 5, motivation: 5 });
      setNotes("");
      setActiveTab("stress");
      onSuccess();
    } catch (error: any) {
      if (process.env.NODE_ENV === "development") {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
          colors: ["#f59e0b", "#14b8a6", "#8b5cf6"],
          disableForReducedMotion: true,
        });
        toast.info("Local mode: Mood logged successfully");
        setValues({ stress: 5, happiness: 5, focus: 5, energy: 5, motivation: 5 });
        setNotes("");
        setActiveTab("stress");
        onSuccess();
      } else {
        toast.error(error.message || "Failed to save mood entry");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (activeIndex < moodDimensions.length - 1) {
      setActiveTab(moodDimensions[activeIndex + 1].key);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveTab(moodDimensions[activeIndex - 1].key);
    }
  };

  return (
    <Card className="border-primary/10 shadow-md overflow-hidden">
      <CardHeader className="pb-4 bg-muted/20 border-b border-border/50">
        <CardTitle className="text-xl flex items-center gap-2">
          <Heart className="h-5 w-5 text-rose-500" />
          How are you feeling?
        </CardTitle>
        <CardDescription>
          Adjust the volume dial for each dimension.
        </CardDescription>

        {/* Slim Scrollable Tab Bar */}
        <div className="flex overflow-x-auto gap-2 py-2 mt-2 custom-scrollbar">
          {moodDimensions.map((dim) => {
            const isActive = dim.key === activeTab;
            return (
              <button
                key={dim.key}
                onClick={() => setActiveTab(dim.key)}
                className={cn(
                  "relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring whitespace-nowrap",
                  isActive 
                    ? "bg-foreground text-background shadow-md" 
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                <span>{dim.icon}</span>
                <span>{dim.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 rounded-full border border-foreground/10"
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        
        {/* Active Dimension Dial UI */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="flex items-center justify-between w-full mb-6">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handlePrev} 
                  disabled={activeIndex === 0}
                  className="rounded-full hover:bg-muted"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                <div className="flex flex-col items-center text-center">
                  <h3 className="text-xl font-bold tracking-tight">{activeDimension.label}</h3>
                  <p className="text-xs text-muted-foreground">Level 1 - 10</p>
                </div>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleNext} 
                  disabled={activeIndex === moodDimensions.length - 1}
                  className="rounded-full hover:bg-muted"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>

              {/* The Volume Dial */}
              <div className="w-full py-4 bg-muted/5 rounded-3xl border border-muted/20 shadow-inner flex justify-center">
                <VolumeDial 
                  value={values[activeTab]} 
                  onChange={(val) => updateValue(activeTab, val)} 
                  colorClass={activeDimension.color.replace("text-", "text-")} 
                />
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        <div className="space-y-2 pt-4 border-t border-border/40">
          <Label htmlFor="mood-notes">Notes (optional)</Label>
          <Textarea
            id="mood-notes"
            placeholder="Anything on your mind? What influenced your mood today?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[80px] resize-none rounded-xl"
          />
        </div>

        <Button onClick={handleSubmit} disabled={isLoading} className="w-full sm:w-auto rounded-full px-8">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Log My Mood
        </Button>
      </CardContent>
    </Card>
  );
}
