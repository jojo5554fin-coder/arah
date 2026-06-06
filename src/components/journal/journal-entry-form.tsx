"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import type { JournalEntry } from "@/app/(dashboard)/journal/page";

interface JournalEntryFormProps {
  onSuccess: () => void;
  existingEntries: JournalEntry[];
}

export function JournalEntryForm({ onSuccess, existingEntries }: JournalEntryFormProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [wentWell, setWentWell] = useState("");
  const [challenges, setChallenges] = useState("");
  const [gratefulFor, setGratefulFor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if an entry already exists for the selected date
  const dateStr = format(date, "yyyy-MM-dd");
  const existingEntry = existingEntries.find(e => e.entry_date === dateStr);

  const handleSubmit = async () => {
    if (!wentWell && !challenges && !gratefulFor) {
      toast.error("Please fill in at least one reflection field.");
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      if (process.env.NODE_ENV === "development" && existingEntry?.id.startsWith('mock')) {
         toast.success("Reflection saved! (Mock)");
         setIsSubmitting(false);
         setWentWell("");
         setChallenges("");
         setGratefulFor("");
         return;
      }

      if (existingEntry) {
        // Update existing
        const { error } = await supabase
          .from("reflections")
          .update({
            went_well: wentWell,
            challenges: challenges,
            grateful_for: gratefulFor
          })
          .eq("id", existingEntry.id);
        
        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from("reflections")
          .insert({
            user_id: user.id,
            entry_date: dateStr,
            went_well: wentWell,
            challenges: challenges,
            grateful_for: gratefulFor
          });
        
        if (error) throw error;
      }

      toast.success(existingEntry ? "Reflection updated!" : "Reflection saved!");
      
      if (!existingEntry) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#3b82f6', '#8b5cf6', '#10b981']
        });
      }

      setWentWell("");
      setChallenges("");
      setGratefulFor("");
      onSuccess();

    } catch (error: any) {
      toast.error(error.message || "Failed to save reflection");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto border-primary/10 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div>
            <CardTitle>Daily Entry</CardTitle>
            <CardDescription>Take a moment to reflect on your day.</CardDescription>
          </div>
          <Popover>
            <PopoverTrigger 
              render={
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[180px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                />
              }
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                disabled={(date) => date > new Date()} // Prevent future logging
              />
            </PopoverContent>
          </Popover>
        </div>
        {existingEntry && (
          <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 p-3 rounded-lg text-sm flex items-center gap-2">
            <Check className="h-4 w-4" /> You already have an entry for this date. Saving will overwrite it.
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <span className="text-xl">🌟</span> What went well today?
          </label>
          <Textarea 
            placeholder="I finished my workout and made progress on my project..."
            className="min-h-[100px] resize-y bg-muted/30 focus-visible:ring-primary/20"
            value={wentWell}
            onChange={(e) => setWentWell(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <span className="text-xl">🧗</span> What challenges did you face?
          </label>
          <Textarea 
            placeholder="I procrastinated in the afternoon and skipped reading..."
            className="min-h-[100px] resize-y bg-muted/30 focus-visible:ring-primary/20"
            value={challenges}
            onChange={(e) => setChallenges(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <span className="text-xl">🙏</span> What are you grateful for?
          </label>
          <Textarea 
            placeholder="A supportive friend, a good cup of coffee..."
            className="min-h-[100px] resize-y bg-muted/30 focus-visible:ring-primary/20"
            value={gratefulFor}
            onChange={(e) => setGratefulFor(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="bg-muted/20 border-t flex justify-end py-4">
        <Button onClick={handleSubmit} disabled={isSubmitting || (!wentWell && !challenges && !gratefulFor)}>
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
          ) : (
            <><Check className="mr-2 h-4 w-4" /> Save Reflection</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
