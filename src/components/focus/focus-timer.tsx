"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Check, Target, Coffee, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type TimerMode = "focus" | "short-break" | "long-break";

const PRESETS: Record<TimerMode, { label: string; duration: number; icon: typeof Zap; color: string; bg: string }> = {
  "focus":       { label: "Focus",       duration: 25 * 60, icon: Zap,    color: "text-primary",       bg: "bg-primary/10" },
  "short-break": { label: "Short Break", duration: 5 * 60,  icon: Coffee, color: "text-emerald-500",   bg: "bg-emerald-500/10" },
  "long-break":  { label: "Long Break",  duration: 15 * 60, icon: Coffee, color: "text-indigo-500",    bg: "bg-indigo-500/10" },
};

interface FocusTimerProps {
  linkedHabit?: { id: string; name: string } | null;
  onHabitComplete?: (habitId: string) => void;
}

export function FocusTimer({ linkedHabit, onHabitComplete }: FocusTimerProps) {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(PRESETS["focus"].duration);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const preset = PRESETS[mode];

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(PRESETS[mode].duration);
    setShowComplete(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [mode]);

  useEffect(() => {
    reset();
  }, [mode, reset]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            setShowComplete(true);
            if (mode === "focus") {
              setSessionsCompleted(s => s + 1);
              toast.success("🎉 Focus session complete!", { description: "Great work! Take a break." });
              // Vibrate on completion
              if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, mode]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const total = PRESETS[mode].duration;
  const progress = (total - timeLeft) / total;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Mode selector */}
      <div className="flex gap-2 p-1 bg-muted rounded-2xl">
        {(Object.keys(PRESETS) as TimerMode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all",
              mode === m ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {PRESETS[m].label}
          </button>
        ))}
      </div>

      {/* Circular timer */}
      <div className="relative w-72 h-72 flex items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" width="288" height="288" viewBox="0 0 288 288">
          {/* Track */}
          <circle cx="144" cy="144" r="120" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/40" />
          {/* Progress */}
          <motion.circle
            cx="144" cy="144" r="120"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            className={preset.color}
            stroke="currentColor"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: isRunning ? "stroke-dashoffset 1s linear" : "none" }}
          />
        </svg>

        {/* Center content */}
        <div className="flex flex-col items-center gap-2 z-10">
          <AnimatePresence mode="wait">
            {showComplete ? (
              <motion.div
                key="complete"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="h-20 w-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Check className="h-10 w-10 text-emerald-500" />
                </div>
                <p className="text-sm font-semibold text-emerald-600">Session Complete!</p>
              </motion.div>
            ) : (
              <motion.div key="timer" className="flex flex-col items-center">
                <span className="text-6xl font-extrabold tabular-nums tracking-tighter">
                  {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </span>
                <span className={cn("text-sm font-medium mt-1", preset.color)}>
                  {preset.label}
                </span>
                {linkedHabit && (
                  <div className="flex items-center gap-1.5 mt-2 px-3 py-1 bg-primary/10 rounded-full">
                    <Target className="h-3 w-3 text-primary" />
                    <span className="text-xs text-primary font-medium truncate max-w-[140px]">{linkedHabit.name}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={reset} className="h-12 w-12 rounded-full">
          <RotateCcw className="h-5 w-5" />
        </Button>
        <Button
          size="lg"
          onClick={() => { setIsRunning(r => !r); setShowComplete(false); }}
          className={cn(
            "h-16 w-16 rounded-full shadow-lg transition-all",
            isRunning ? "shadow-primary/30" : "hover:scale-105"
          )}
        >
          {isRunning ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-0.5" />}
        </Button>
        {showComplete && linkedHabit && onHabitComplete && (
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full border-emerald-500 text-emerald-600 hover:bg-emerald-500/10"
            onClick={() => { onHabitComplete(linkedHabit.id); setShowComplete(false); }}
          >
            <Check className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Session counter */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Sessions today:</span>
        <div className="flex gap-1.5">
          {Array.from({ length: Math.max(4, sessionsCompleted + 1) }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2.5 w-2.5 rounded-full transition-all",
                i < sessionsCompleted ? "bg-primary scale-110" : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
