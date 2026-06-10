"use client";

import { useState, useEffect } from "react";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";
import { BarChart3, AlertCircle } from "lucide-react";
import { WeeklyReportCard } from "@/components/reports/weekly-report-card";
import { MoodHabitCorrelationCard } from "@/components/reports/mood-habit-correlation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface WeeklyReport {
  id: string;
  user_id: string;
  week_start: string;
  week_end: string;
  consistency_score: number;
  momentum_score: number;
  habit_performance: {
    habit_id: string;
    name: string;
    completed: number;
    expected: number;
    rate: number;
  }[];
  goal_progress: {
    goal_id: string;
    title: string;
    current_progress: number;
  }[];
  mood_trends: {
    averages: {
      stress: number;
      happiness: number;
      focus: number;
      energy: number;
      motivation: number;
    };
    entries_count: number;
  };
  ai_summary: string | null;
  top_insight: string | null;
  recommendations: string[] | null;
  created_at: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [habits, setHabits] = useState<any[]>([]);
  const [completions, setCompletions] = useState<any[]>([]);
  const [moodEntries, setMoodEntries] = useState<any[]>([]);

  const fetchReports = async () => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      const { data, error } = await supabase
        .from("weekly_reports")
        .select("*")
        .eq("user_id", user.id)
        .order("week_start", { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error: any) {
      if (process.env.NODE_ENV === "development") {
        // Generate mock reports for testing
        const mockReports: WeeklyReport[] = Array.from({ length: 3 }).map((_, i) => {
          const date = new Date();
          const start = startOfWeek(subDays(date, i * 7), { weekStartsOn: 1 });
          const end = endOfWeek(subDays(date, i * 7), { weekStartsOn: 1 });
          
          return {
            id: `mock-report-${i}`,
            user_id: "mock-user",
            week_start: format(start, "yyyy-MM-dd"),
            week_end: format(end, "yyyy-MM-dd"),
            consistency_score: Math.floor(Math.random() * 40) + 60, // 60-100
            momentum_score: Math.floor(Math.random() * 50) + 50, // 50-100
            habit_performance: [
              { habit_id: "h1", name: "Morning Workout", completed: Math.floor(Math.random() * 4) + 3, expected: 7, rate: 0 },
              { habit_id: "h2", name: "Read 10 Pages", completed: 7, expected: 7, rate: 100 },
              { habit_id: "h3", name: "Meditate", completed: Math.floor(Math.random() * 7), expected: 7, rate: 0 },
            ].map(h => ({ ...h, rate: Math.round((h.completed / h.expected) * 100) })),
            goal_progress: [
              { goal_id: "g1", title: "Launch App MVP", current_progress: Math.floor(Math.random() * 30) + 40 },
            ],
            mood_trends: {
              averages: {
                stress: Math.floor(Math.random() * 5) + 3,
                happiness: Math.floor(Math.random() * 4) + 6,
                focus: Math.floor(Math.random() * 4) + 5,
                energy: Math.floor(Math.random() * 4) + 6,
                motivation: Math.floor(Math.random() * 3) + 7,
              },
              entries_count: Math.floor(Math.random() * 3) + 5,
            },
            ai_summary: i === 0 ? "You had a fantastic week, maintaining a solid routine and showing excellent progress on your goals." : null,
            top_insight: i === 0 ? "You're most consistent with reading when you also do your morning workout." : null,
            recommendations: i === 0 ? ["Try to meditate earlier in the day to improve completion rate.", "Keep up the momentum on your reading habit!"] : null,
            created_at: new Date().toISOString(),
          };
        });
        setReports(mockReports);
        if (mockReports.length > 0) {
          setSelectedReportId(mockReports[0].id);
        }
      } else {
        toast.error("Failed to load reports");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchCorrelationData();
  }, []);

  const fetchCorrelationData = async () => {
    const supabase = createClient();
    try {
      const { data: habitsData } = await supabase.from("habits").select("id, name, color");
      const { data: compData } = await supabase
        .from("habit_completions")
        .select("habit_id, completed_at, completion_type")
        .gte("completed_at", subDays(new Date(), 30).toISOString());
      const { data: moodData } = await supabase
        .from("mood_entries")
        .select("logged_at, stress, happiness, focus, energy, motivation")
        .gte("logged_at", subDays(new Date(), 30).toISOString());
      if (habitsData) setHabits(habitsData);
      if (compData) setCompletions(compData);
      if (moodData) setMoodEntries(moodData);
    } catch {
      // Correlation data is optional — silently fail
    }
  };

  const generateReportNow = async () => {
    toast.success("Generating report...");
    // Future: Call a server action or API to invoke generate_weekly_report
    setTimeout(() => {
      fetchReports();
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="page-header">
        <div>
          <h2 className="page-title">Weekly Reports</h2>
          <p className="page-subtitle">Your behavioral analytics and progress summaries.</p>
        </div>
        <Button onClick={generateReportNow} variant="outline" className="shrink-0">
          Generate New
        </Button>
      </div>

      {!isLoading && reports.length > 0 && (
        <div className="flex items-center gap-4 bg-muted/20 p-4 rounded-xl border">
          <span className="text-sm font-medium whitespace-nowrap">Select Week:</span>
          <Select value={selectedReportId || ""} onValueChange={setSelectedReportId}>
            <SelectTrigger className="w-full sm:w-[280px] bg-background">
              <SelectValue placeholder="Select a report..." />
            </SelectTrigger>
            <SelectContent>
              {reports.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {format(new Date(r.week_start), "MMM d")} - {format(new Date(r.week_end), "MMM d, yyyy")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-96 w-full bg-muted/50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-24 px-4 bg-muted/20 rounded-2xl border border-dashed border-border/50">
          <div className="mx-auto w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Reports Yet</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mb-6">
            Your first weekly report will be generated at the end of the week.
          </p>
          <Button onClick={generateReportNow}>Generate Report Now</Button>
        </div>
      ) : selectedReportId ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          <WeeklyReportCard report={reports.find(r => r.id === selectedReportId) || reports[0]} />
          <MoodHabitCorrelationCard
            habits={habits}
            completions={completions}
            moodEntries={moodEntries}
          />
        </div>
      ) : null}
    </div>
  );
}
