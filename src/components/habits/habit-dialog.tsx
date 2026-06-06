"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  const [reminderTime, setReminderTime] = useState(habit?.reminder_time || "");
  const [color, setColor] = useState(habit?.color || "emerald");

  // Update state when habit prop changes (for editing)
  useEffect(() => {
    if (open) {
      setName(habit?.name || "");
      setCategory(habit?.category || "");
      setFrequency(habit?.frequency || "daily");
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

    setIsLoading(true);
    const supabase = createClient();

    try {
      if (isEditing && habit) {
        const { error } = await supabase
          .from("habits")
          .update({
            name,
            category,
            frequency,
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
            frequency,
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
            <RadioGroup value={frequency} onValueChange={setFrequency} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily" className="font-normal">Daily</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekdays" id="weekdays" />
                <Label htmlFor="weekdays" className="font-normal">Weekdays</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly" className="font-normal">Weekly</Label>
              </div>
            </RadioGroup>
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
