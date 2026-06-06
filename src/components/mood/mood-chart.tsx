"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format, parseISO } from "date-fns";
import { moodDimensions } from "@/config/mood";

interface MoodEntry {
  id: string;
  stress: number;
  happiness: number;
  energy: number;
  focus: number;
  motivation: number;
  created_at: string;
}

interface MoodChartProps {
  entries: MoodEntry[];
}

export function MoodChart({ entries }: MoodChartProps) {
  const chartData = useMemo(() => {
    // Sort chronologically (oldest to newest)
    const sorted = [...entries].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    return sorted.map(entry => ({
      date: format(parseISO(entry.created_at), "MMM d"),
      ...entry
    }));
  }, [entries]);

  if (entries.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mood Trends</CardTitle>
          <CardDescription>Track how your mood changes over time.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground border-t border-border/40">
          <p>Log your mood for at least 2 days to see your trends graph.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood Trends</CardTitle>
        <CardDescription>Your emotional landscape over the past entries.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.2)" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                dy={10}
              />
              <YAxis 
                domain={[0, 10]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--background))", 
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}
                itemStyle={{ fontSize: 14, fontWeight: 500 }}
                labelStyle={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginBottom: "4px" }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: "20px" }}
                iconType="circle"
              />
              {moodDimensions.map(dim => (
                <Line
                  key={dim.key}
                  type="monotone"
                  dataKey={dim.key}
                  name={dim.label}
                  stroke={`var(--${dim.color.replace('text-', '')})`}
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
