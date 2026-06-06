"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoodEntryForm } from "@/components/mood/mood-entry-form";
import { MoodHistory } from "@/components/mood/mood-history";
import { MoodChart } from "@/components/mood/mood-chart";
import { MoodAverages } from "@/components/mood/mood-averages";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { MoodEntry } from "@/config/mood";

export default function MoodPage() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEntries = async () => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      const { data, error } = await supabase
        .from("mood_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(14);

      if (error) throw error;
      setEntries(data || []);
    } catch (error: any) {
      if (process.env.NODE_ENV === "development") {
        // Generate realistic mock data for the past 7 days
        const mockEntries: MoodEntry[] = Array.from({ length: 7 }).map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          date.setHours(9 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 60));
          return {
            id: `mock-${i}`,
            stress: Math.floor(Math.random() * 5) + 3,
            happiness: Math.floor(Math.random() * 4) + 5,
            focus: Math.floor(Math.random() * 5) + 4,
            energy: Math.floor(Math.random() * 4) + 4,
            motivation: Math.floor(Math.random() * 5) + 4,
            notes: i === 0 ? "Had a really productive morning!" : i === 2 ? "Feeling a bit tired today." : null,
            created_at: date.toISOString(),
          };
        });
        setEntries(mockEntries);
      } else {
        toast.error("Failed to load mood entries");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Mood Tracker</h2>
          <p className="page-subtitle">Understand your emotional patterns across 5 key dimensions.</p>
        </div>
      </div>

      {/* Tabs: Log / History */}
      <Tabs defaultValue="log" className="w-full">
        <TabsList className="grid w-full max-w-sm grid-cols-2">
          <TabsTrigger value="log">Log Mood</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="log" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Entry Form — Main Column */}
            <div className="lg:col-span-8">
              <MoodEntryForm onSuccess={fetchEntries} />
            </div>

            {/* Averages Sidebar */}
            <div className="lg:col-span-4">
              <MoodAverages entries={entries} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 w-full bg-muted/50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <MoodChart entries={entries} />
              <MoodHistory entries={entries} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
