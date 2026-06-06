"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Activity, Flame } from "lucide-react";

export function AverageActivityPopup() {
  const [isOpen, setIsOpen] = useState(false);

  // In a real app, these would be computed from the last 7 days of data
  // For now, we use realistic dummy averages as the user requested a popup showcase.
  const averages = {
    mood: "😊 Happy",
    completionRate: 82,
    streak: 12,
    bestCategory: "Fitness",
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger 
        render={<Button variant="secondary" size="sm" className="gap-2 shadow-sm" />}
      >
        <BarChart3 className="h-4 w-4" /> 7-Day Averages
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Your Recent Activity
          </DialogTitle>
          <DialogDescription>
            Here is how you have been doing over the last 7 days.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="bg-muted/50 p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
            <div className="p-2 bg-background rounded-full shadow-sm">
              <span className="text-2xl">{averages.mood.split(' ')[0]}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Mood</p>
              <p className="text-xl font-bold">{averages.mood.split(' ')[1]}</p>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
            <div className="p-2 bg-background rounded-full shadow-sm">
              <Activity className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
              <p className="text-xl font-bold">{averages.completionRate}%</p>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
            <div className="p-2 bg-background rounded-full shadow-sm">
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Momentum</p>
              <p className="text-xl font-bold">{averages.streak} Days</p>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
            <div className="p-2 bg-background rounded-full shadow-sm">
              <span className="text-2xl">🏆</span>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Top Category</p>
              <p className="text-xl font-bold">{averages.bestCategory}</p>
            </div>
          </div>
        </div>
        
        <div className="text-center pt-2">
          <p className="text-sm text-muted-foreground">
            You're doing great! Consistency is key.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
