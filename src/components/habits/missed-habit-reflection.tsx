"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2, Brain, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface MissedHabitReflectionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habitId: string;
  habitName: string;
  onSuccess?: () => void;
}

const REASONS = [
  { value: "No time / Too busy", emoji: "⏰" },
  { value: "Lack of energy / Tired", emoji: "🔋" },
  { value: "Forgot / Distracted", emoji: "🧠" },
  { value: "Weather / Environment", emoji: "🌧️" },
  { value: "Needed a break / Recharge", emoji: "💆" },
];

export function MissedHabitReflection({
  open,
  onOpenChange,
  habitId,
  habitName,
  onSuccess,
}: MissedHabitReflectionProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) {
      toast.error("Please select a reason.");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      const todayStr = new Date().toISOString().split("T")[0];

      // Fetch today's reflection if it exists
      const { data: existing, error: fetchError } = await supabase
        .from("reflections")
        .select("id, challenges")
        .eq("user_id", user.id)
        .eq("entry_date", todayStr)
        .maybeSingle();

      if (fetchError) throw fetchError;

      const reflectionText = `- Missed "${habitName}" because: ${selectedReason}${notes ? ` (${notes})` : ""}`;
      const updatedChallenges = existing
        ? (existing.challenges ? `${existing.challenges}\n${reflectionText}` : reflectionText)
        : reflectionText;

      if (existing) {
        const { error } = await supabase
          .from("reflections")
          .update({ challenges: updatedChallenges })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("reflections")
          .insert({
            user_id: user.id,
            entry_date: todayStr,
            challenges: updatedChallenges,
            went_well: "",
            grateful_for: "",
          });
        if (error) throw error;
      }

      toast.success("Logged reflection. Remember, consistency is a journey, not a streak! 🌱");
      
      setSelectedReason(null);
      setNotes("");
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error(error);
      if (process.env.NODE_ENV === "development") {
        toast.info("Local mode: simulated reflection log.");
        setSelectedReason(null);
        setNotes("");
        onOpenChange(false);
        if (onSuccess) onSuccess();
      } else {
        toast.error(error.message || "Failed to save reflection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl border-primary/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Brain className="h-5 w-5 text-primary" />
            Reflect on your day
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs leading-relaxed pt-1">
            Missing a day is part of the growth process. Let's note down why so we can build a better environment tomorrow.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          <div className="space-y-2.5">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Why did you miss "{habitName}"?</Label>
            <div className="grid grid-cols-1 gap-2">
              {REASONS.map((r) => {
                const isSelected = selectedReason === r.value;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setSelectedReason(r.value)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm font-semibold transition-all text-left",
                      isSelected
                        ? "bg-primary/10 border-primary text-primary shadow-sm"
                        : "border-border hover:border-primary/30 hover:bg-muted/30 text-foreground"
                    )}
                  >
                    <span className="text-lg">{r.emoji}</span>
                    <span className="flex-1">{r.value}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="What could you do next time to make it easier?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="rounded-2xl border-border min-h-[80px] text-sm resize-none focus-visible:ring-primary/20"
            />
          </div>

          <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-xl w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !selectedReason}
              className="rounded-xl w-full sm:w-auto shadow-md"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Reflection
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
