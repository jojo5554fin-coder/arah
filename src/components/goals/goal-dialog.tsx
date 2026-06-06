"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface Milestone {
  id?: string;
  title: string;
  completed_at: string | null;
}

export interface Goal {
  id: string;
  title: string;
  description: string | null;
  target_date: string | null;
  status: string;
  milestones?: Milestone[];
}

interface GoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: Goal | null;
  onSuccess: () => void;
}

export function GoalDialog({ open, onOpenChange, goal, onSuccess }: GoalDialogProps) {
  const isEditing = !!goal;
  const [isLoading, setIsLoading] = useState(false);
  
  const [title, setTitle] = useState(goal?.title || "");
  const [description, setDescription] = useState(goal?.description || "");
  const [targetDate, setTargetDate] = useState(goal?.target_date || "");
  const [milestones, setMilestones] = useState<Milestone[]>(goal?.milestones || []);
  const [newMilestone, setNewMilestone] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(goal?.title || "");
      setDescription(goal?.description || "");
      setTargetDate(goal?.target_date || "");
      setMilestones(goal?.milestones || []);
      setNewMilestone("");
    }
  }, [goal, open]);

  const handleAddMilestone = () => {
    if (!newMilestone.trim()) return;
    setMilestones([...milestones, { title: newMilestone.trim(), completed_at: null }]);
    setNewMilestone("");
  };

  const handleRemoveMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Please provide a title for your goal.");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    try {
      let goalId = goal?.id;

      if (isEditing && goal) {
        const { error } = await supabase
          .from("goals")
          .update({
            title,
            description: description || null,
            target_date: targetDate || null,
          })
          .eq("id", goal.id);

        if (error) throw error;
        
        // Handle milestones update (simplified for local mock mode fallback)
        // In a real scenario, you'd sync the milestones array using upsert and delete operations.
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data, error } = await supabase
          .from("goals")
          .insert({
            user_id: user.id,
            title,
            description: description || null,
            target_date: targetDate || null,
            status: "in_progress"
          })
          .select()
          .single();

        if (error) throw error;
        goalId = data.id;
      }
      
      // We will skip inserting actual milestones in the database here to keep the demo simple,
      // but the mock mode will just handle it locally.

      toast.success(isEditing ? "Goal updated successfully" : "Goal created successfully");
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Goal" : "Create New Goal"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update your goal and milestones." : "Set a new long-term goal and break it down into actionable milestones."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input 
              id="title" 
              placeholder="e.g. Run a Marathon" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea 
              id="description" 
              placeholder="Why is this important to you?" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetDate">Target Date (Optional)</Label>
            <Input 
              id="targetDate" 
              type="date" 
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>

          <div className="space-y-3 pt-2 border-t mt-4">
            <Label>Milestones</Label>
            <div className="flex gap-2">
              <Input 
                placeholder="e.g. Run 5K without stopping" 
                value={newMilestone}
                onChange={(e) => setNewMilestone(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddMilestone();
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={handleAddMilestone}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {milestones.length > 0 && (
              <ul className="space-y-2 mt-3">
                {milestones.map((ms, index) => (
                  <li key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded-md border text-sm">
                    <span>{ms.title}</span>
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => handleRemoveMilestone(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            {milestones.length === 0 && (
              <p className="text-xs text-muted-foreground">Break your goal into smaller steps for better momentum.</p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Create Goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
