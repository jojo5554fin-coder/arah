"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JournalEntryForm } from "@/components/journal/journal-entry-form";
import { JournalHistory } from "@/components/journal/journal-history";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

export interface JournalEntry {
  id: string;
  went_well: string;
  challenges: string;
  grateful_for: string;
  entry_date: string; // The specific date this journal is for
  created_at: string;
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEntries = async () => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      const { data, error } = await supabase
        .from("reflections")
        .select("*")
        .eq("user_id", user.id)
        .order("entry_date", { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error: any) {
      if (process.env.NODE_ENV === "development") {
        // Mock data
        const mockEntries: JournalEntry[] = Array.from({ length: 5 }).map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return {
            id: `mock-${i}`,
            went_well: "Completed all my habits and had a great workout.",
            challenges: "Struggled to focus during the afternoon meeting.",
            grateful_for: "A nice message from an old friend.",
            entry_date: format(date, "yyyy-MM-dd"),
            created_at: date.toISOString(),
          };
        });
        setEntries(mockEntries);
      } else {
        toast.error("Failed to load journal entries");
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
      <div className="page-header">
        <div>
          <h2 className="page-title">Daily Reflection</h2>
          <p className="page-subtitle">Reflect on your progress, acknowledge challenges, and practice gratitude.</p>
        </div>
      </div>

      <Tabs defaultValue="write" className="w-full">
        <TabsList className="grid w-full max-w-sm grid-cols-2">
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="write" className="mt-6">
          <JournalEntryForm onSuccess={fetchEntries} existingEntries={entries} />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 w-full bg-muted/50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <JournalHistory entries={entries} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
