"use client";

import { useState } from "react";
import { Check, MoreVertical, Trophy, Edit2, Trash2, Share2, Target, Route } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { ShareDialog } from "@/components/share/share-dialog";
import { motion, AnimatePresence } from "framer-motion";
import type { Goal } from "./goal-dialog";

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onToggleMilestone: (goalId: string, milestoneIndex: number, completed: boolean) => void;
}

export function GoalCard({ goal, onEdit, onDelete, onToggleMilestone }: GoalCardProps) {
  const [localMilestones, setLocalMilestones] = useState(goal.milestones || []);
  
  const completedCount = localMilestones.filter(m => m.completed_at !== null).length;
  const totalCount = localMilestones.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const handleToggle = (index: number) => {
    const isCurrentlyCompleted = localMilestones[index].completed_at !== null;
    const newState = !isCurrentlyCompleted;
    
    // Optimistic UI
    const updated = [...localMilestones];
    updated[index].completed_at = newState ? new Date().toISOString() : null;
    setLocalMilestones(updated);

    if (newState) {
      // Small confetti for milestone
      confetti({
        particleCount: 30,
        spread: 40,
        origin: { y: 0.8 },
        colors: ['#fbbf24', '#14b8a6', '#8b5cf6'],
        disableForReducedMotion: true,
      });

      // Big confetti if 100%
      const newCompletedCount = updated.filter(m => m.completed_at !== null).length;
      if (newCompletedCount === totalCount) {
        setTimeout(() => {
          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.5 },
            disableForReducedMotion: true,
            zIndex: 200,
          });
        }, 300);
      }
    }

    onToggleMilestone(goal.id, index, newState);
  };

  return (
    <Card className="transition-all duration-300 hover:shadow-lg border-border/60 overflow-hidden group">
      {/* Top Progress Bar - Subtle accent */}
      <div className="h-1.5 w-full bg-muted/50">
        <motion.div 
          className="h-full bg-gradient-to-r from-primary/80 to-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0 relative">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={cn(
              "p-2 rounded-xl transition-colors duration-500",
              progressPercent === 100 ? "bg-amber-500/20 text-amber-500" : "bg-primary/10 text-primary"
            )}>
              {progressPercent === 100 ? <Trophy className="h-5 w-5" /> : <Target className="h-5 w-5" />}
            </div>
            {progressPercent === 100 && (
              <motion.span 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider"
              >
                Conquered
              </motion.span>
            )}
          </div>
          <CardTitle className="text-xl font-bold leading-tight">{goal.title}</CardTitle>
          {goal.description && <CardDescription className="line-clamp-2">{goal.description}</CardDescription>}
          {goal.target_date && (
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-2">
              Target: {new Date(goal.target_date).toLocaleDateString()}
            </p>
          )}
        </div>
        
        <div className="flex items-center -mr-2 -mt-2">
          <ShareDialog
            title={goal.title}
            subtitle="Goal Progress"
            theme="amethyst"
            metrics={[
              { label: "Milestones", value: `${completedCount}/${totalCount}` },
              { label: "Completion", value: `${progressPercent}%` }
            ]}
            trigger={
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share goal</span>
              </Button>
            }
          />
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon" />}
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(goal)}>
                <Edit2 className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(goal.id)} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        {localMilestones.length > 0 ? (
          <div className="mt-4 bg-muted/10 rounded-xl p-4 border border-dashed">
            <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Route className="h-3.5 w-3.5" />
              <span>Milestone Path</span>
              <span className="ml-auto bg-background px-2 py-0.5 rounded-full border shadow-sm text-foreground">
                {completedCount}/{totalCount}
              </span>
            </div>

            {/* Vertical Stepping Stones */}
            <div className="relative pl-3 ml-2 space-y-6 before:absolute before:inset-0 before:ml-[3px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted before:to-transparent">
              
              {/* Animated Progress Line filling the path */}
              <div className="absolute top-0 bottom-0 left-[3px] w-0.5 -translate-x-px origin-top overflow-hidden">
                <motion.div 
                  className="w-full bg-primary absolute top-0 left-0"
                  initial={{ height: 0 }}
                  animate={{ height: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </div>

              {localMilestones.map((ms, index) => {
                const isCompleted = ms.completed_at !== null;
                return (
                  <div 
                    key={index} 
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group cursor-pointer"
                    onClick={() => handleToggle(index)}
                  >
                    {/* The Stone (Node) */}
                    <motion.div 
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className={cn(
                        "absolute left-[-21px] flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-300 z-10",
                        isCompleted 
                          ? "bg-primary border-primary shadow-sm shadow-primary/40 text-primary-foreground" 
                          : "bg-background border-muted group-hover:border-primary/50 text-transparent"
                      )}
                    >
                      <AnimatePresence>
                        {isCompleted && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Milestone Content */}
                    <div className="ml-6 flex-1 pl-1">
                      <div className={cn(
                        "p-3 rounded-lg border bg-background shadow-sm transition-all duration-300",
                        isCompleted ? "border-primary/20 bg-primary/5" : "group-hover:border-primary/30"
                      )}>
                        <p className={cn(
                          "text-sm font-medium transition-colors",
                          isCompleted ? "text-primary" : "text-foreground group-hover:text-primary/80"
                        )}>
                          {ms.title}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-4 pt-4 text-sm text-center text-muted-foreground border-t border-border/40">
            No milestones set yet. Edit goal to add your path.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
