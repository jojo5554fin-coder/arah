"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categoryList } from "@/config/categories";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface Habit {
  id: string;
  name: string;
  category: string;
  frequency: string;
  reminder_time?: string | null;
  is_active: boolean;
  color?: string | null;
}

interface HabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit?: Habit | null;
  onSuccess: () => void;
}

export function HabitDialog({ open, onOpenChange, habit, onSuccess }: HabitDialogProps) {
  const isEditing = !!habit;
  const [isLoading, setIsLoading] = useState(false);
  
  const [name, setName] = useState(habit?.name || "");
  const [category, setCategory] = useState(habit?.category || "");
  const [frequency, setFrequency] = useState(habit?.frequency || "daily");
  const [customDays, setCustomDays] = useState<string[]>([]);
  const [reminderTime, setReminderTime] = useState(habit?.reminder_time || "");
  const [color, setColor] = useState(habit?.color || "emerald");

  const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const FREQ_OPTIONS = [
    { value: "daily", label: "Every day" },
    { value: "weekdays", label: "Weekdays (Mon–Fri)" },
    { value: "weekends", label: "Weekends only" },
    { value: "custom-days", label: "Specific days" },
    { value: "2x", label: "2× per week" },
    { value: "3x", label: "3× per week" },
    { value: "4x", label: "4× per week" },
    { value: "weekly", label: "Once a week" },
  ];

  // Update state when habit prop changes (for editing)
  useEffect(() => {
    if (open) {
      setName(habit?.name || "");
      setCategory(habit?.category || "");
      
      const freq = habit?.frequency || "daily";
      const isStandard = ["daily", "weekdays", "weekends", "2x", "3x", "4x", "weekly"].includes(freq);
      if (isStandard) {
        setFrequency(freq);
        setCustomDays([]);
      } else {
        setFrequency("custom-days");
        setCustomDays(freq.split(","));
      }

      setReminderTime(habit?.reminder_time || "");
      setColor(habit?.color || "emerald");
    }
  }, [habit, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category) {
      toast.error("Please provide a name and category.");
      return;
    }

    if (frequency === "custom-days" && customDays.length === 0) {
      toast.error("Please select at least one day.");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();
    const freqToSave = frequency === "custom-days" ? customDays.join(",") : frequency;

    try {
      if (isEditing && habit) {
        const { error } = await supabase
          .from("habits")
          .update({
            name,
            category,
            frequency: freqToSave,
            reminder_time: reminderTime || null,
            color,
          })
          .eq("id", habit.id);

        if (error) throw error;
        toast.success("Habit updated successfully");
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { error } = await supabase
          .from("habits")
          .insert({
            user_id: user.id,
            name,
            category,
            frequency: freqToSave,
            reminder_time: reminderTime || null,
            color,
            is_active: true,
          });

        if (error) throw error;
        toast.success("Habit created successfully");
      }
      
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error(error);
      if (process.env.NODE_ENV === "development") {
        toast.info("Local mode: Simulated save success.");
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error(error.message || "Something went wrong.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Habit" : "Create New Habit"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Make changes to your habit here." : "Add a new habit to track your personal growth."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              placeholder="e.g. Morning Meditation" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(val) => setCategory(val || "")}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categoryList.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Trace Color</Label>
            <div className="flex gap-3">
              {["emerald", "blue", "indigo", "rose", "amber"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all",
                    color === c ? "border-foreground scale-110 shadow-sm" : "border-transparent hover:scale-105"
                  )}
                  style={{
                    backgroundColor: `var(--${c}-500, ${c === 'emerald' ? '#10b981' : c === 'blue' ? '#3b82f6' : c === 'indigo' ? '#6366f1' : c === 'rose' ? '#f43f5e' : '#f59e0b'})`
                  }}
                  aria-label={`Select ${c} color`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Frequency</Label>
            <Select value={frequency} onValueChange={(val) => setFrequency(val || "daily")}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="How often?" />
              </SelectTrigger>
              <SelectContent>
                {FREQ_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {frequency === "custom-days" && (
              <div className="flex gap-2 flex-wrap">
                {DAYS.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setCustomDays(prev =>
                      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
                    )}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all",
                      customDays.includes(day)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    )}
                  >
                    {day}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminder">Reminder Time (Optional)</Label>
            <Input 
              id="reminder" 
              type="time" 
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Create Habit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
