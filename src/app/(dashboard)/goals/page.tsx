"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { GoalDialog, type Goal } from "@/components/goals/goal-dialog";
import { GoalCard } from "@/components/goals/goal-card";
import { motion } from "framer-motion";

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const fetchGoals = async () => {
    setIsLoading(true);
    const supabase = createClient();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      const { data, error } = await supabase
        .from("goals")
        .select("*, milestones:goal_milestones(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error: any) {
      if (process.env.NODE_ENV === "development") {
        // Mock data
        setGoals([
          {
            id: "1",
            title: "Run a Marathon",
            description: "Train for the KL Marathon in November",
            target_date: "2026-11-01",
            status: "in_progress",
            milestones: [
              { title: "Run 5km without stopping", completed_at: new Date().toISOString() },
              { title: "Run 10km", completed_at: null },
              { title: "Run Half Marathon", completed_at: null },
            ]
          },
          {
            id: "2",
            title: "Read 12 Books",
            description: "One book per month minimum",
            target_date: "2026-12-31",
            status: "in_progress",
            milestones: [
              { title: "Book 1", completed_at: new Date().toISOString() },
              { title: "Book 2", completed_at: new Date().toISOString() },
              { title: "Book 3", completed_at: null },
            ]
          }
        ]);
      } else {
        toast.error("Failed to load goals");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreate = () => {
    setEditingGoal(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;
    
    const supabase = createClient();
    try {
      const { error } = await supabase.from("goals").delete().eq("id", id);
      if (error) throw error;
      fetchGoals();
      toast.success("Goal deleted");
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        setGoals(goals.filter(g => g.id !== id));
        toast.info("Local mode: goal deleted");
      }
    }
  };

  const handleToggleMilestone = async (goalId: string, milestoneIndex: number, completed: boolean) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal || !goal.milestones) return;
    
    const milestone = goal.milestones[milestoneIndex];
    
    // In a real app we'd update Supabase here based on milestone.id
    if (process.env.NODE_ENV === "development") {
       // Mock state update already handled optimistically in the card, 
       // but we should sync it back to parent state if we want persistence across renders.
       setGoals(prev => prev.map(g => {
         if (g.id === goalId && g.milestones) {
           const updatedM = [...g.milestones];
           updatedM[milestoneIndex].completed_at = completed ? new Date().toISOString() : null;
           return { ...g, milestones: updatedM };
         }
         return g;
       }));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h2 className="page-title">Your Goals</h2>
          <p className="page-subtitle">Set milestones and track your long-term progress.</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Create Goal
        </Button>
      </div>

      <GoalDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        goal={editingGoal} 
        onSuccess={fetchGoals} 
      />

      {isLoading ? (
        <div className="grid-responsive-2">
          {[1, 2].map(i => (
            <div key={i} className="h-64 w-full bg-muted/50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : goals.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-3xl bg-muted/10"
        >
          <div className="h-24 w-24 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center text-5xl mb-6 shadow-inner ring-1 ring-amber-500/20">
            🏆
          </div>
          <h3 className="text-2xl font-bold tracking-tight mb-2">Aim Higher</h3>
          <p className="text-muted-foreground max-w-[400px] mb-8">
            Habits are the vehicle, but Goals are the destination. Set a target to give your daily routines a clear direction.
          </p>
          <Button onClick={handleCreate} size="lg" className="h-12 px-8 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
            <Plus className="mr-2 h-5 w-5" /> Set Your First Goal
          </Button>
        </motion.div>
      ) : (
        <div className="grid-responsive-2">
          {goals.map((goal) => (
            <GoalCard 
              key={goal.id} 
              goal={goal} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
              onToggleMilestone={handleToggleMilestone}
            />
          ))}
        </div>
      )}
    </div>
  );
}
