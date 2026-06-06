"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format, parseISO } from "date-fns";
import { CalendarDays, Target, Brain, TrendingUp, Sparkles, AlertCircle } from "lucide-react";
import type { WeeklyReport } from "@/app/(dashboard)/reports/page";
import { moodDimensions } from "@/config/mood";

interface WeeklyReportCardProps {
  report: WeeklyReport;
}

export function WeeklyReportCard({ report }: WeeklyReportCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <Card className="border-primary/10 shadow-md overflow-hidden">
      <CardHeader className="bg-muted/30 border-b pb-6">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <CalendarDays className="h-6 w-6 text-primary" />
              Weekly Summary
            </CardTitle>
            <CardDescription className="text-base mt-1">
              {format(parseISO(report.week_start), "MMM do")} - {format(parseISO(report.week_end), "MMM do, yyyy")}
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Consistency</p>
            <p className={`text-4xl font-black ${getScoreColor(report.consistency_score)}`}>
              {report.consistency_score}%
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-8 space-y-10">
        
        {/* Top Insights (AI or Generated) */}
        {(report.ai_summary || report.top_insight) && (
          <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-3 text-primary">
              <Sparkles className="h-5 w-5" /> Executive Summary
            </h3>
            {report.ai_summary && <p className="text-foreground leading-relaxed mb-4">{report.ai_summary}</p>}
            {report.top_insight && (
              <div className="bg-background rounded-xl p-4 shadow-sm border border-border/50 flex items-start gap-3">
                <Brain className="h-5 w-5 text-purple-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-sm mb-1 text-purple-600 dark:text-purple-400">Key Behavioral Insight</p>
                  <p className="text-sm text-muted-foreground">{report.top_insight}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Habits Performance */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
              <Target className="h-5 w-5 text-blue-500" /> Habit Performance
            </h3>
            {report.habit_performance.length > 0 ? (
              <div className="space-y-4">
                {report.habit_performance.map((habit) => (
                  <div key={habit.habit_id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{habit.name}</span>
                      <span className="text-muted-foreground">{habit.completed}/{habit.expected} ({habit.rate}%)</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getScoreBg(habit.rate)}`} 
                        style={{ width: `${habit.rate}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No habits tracked this week.</p>
            )}
          </div>

          {/* Mood Averages */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
              <TrendingUp className="h-5 w-5 text-rose-500" /> Emotional Landscape
            </h3>
            {report.mood_trends.entries_count > 0 ? (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">
                  Based on {report.mood_trends.entries_count} entries
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {moodDimensions.map(dim => {
                    // @ts-ignore
                    const avgValue = report.mood_trends.averages[dim.key] as number;
                    return (
                      <div key={dim.key} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${dim.bgColor} ${dim.color}`}>
                          {dim.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium">{dim.label}</span>
                            <span>{avgValue.toFixed(1)}/10</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${dim.sliderColor}`} 
                              style={{ width: `${(avgValue / 10) * 100}%` }} 
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No mood data logged this week.</p>
            )}
          </div>
        </div>

      </CardContent>

      {/* Recommendations */}
      {report.recommendations && report.recommendations.length > 0 && (
        <CardFooter className="bg-muted/10 border-t flex flex-col items-start p-6">
          <h4 className="font-bold mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" /> Action Items for Next Week
          </h4>
          <ul className="space-y-2 w-full">
            {report.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-amber-500 font-bold">•</span> {rec}
              </li>
            ))}
          </ul>
        </CardFooter>
      )}
    </Card>
  );
}
