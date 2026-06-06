"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { BookText } from "lucide-react";
import type { JournalEntry } from "@/app/(dashboard)/journal/page";

interface JournalHistoryProps {
  entries: JournalEntry[];
}

export function JournalHistory({ entries }: JournalHistoryProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-20 px-4 bg-muted/20 rounded-2xl border border-dashed border-border/50">
        <div className="mx-auto w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
          <BookText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Reflections Yet</h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Start journaling to track your thoughts, challenges, and gratitude over time.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {entries.map((entry) => (
        <Card key={entry.id} className="overflow-hidden border-primary/10 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="bg-muted/30 pb-4 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                {format(parseISO(entry.entry_date), "EEEE, MMMM do, yyyy")}
              </CardTitle>
              <CardDescription>
                {format(parseISO(entry.created_at), "h:mm a")}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6 grid gap-6 md:grid-cols-3">
            {entry.went_well && (
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2 text-primary">
                  <span>🌟</span> Went Well
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {entry.went_well}
                </p>
              </div>
            )}
            
            {entry.challenges && (
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2 text-amber-600 dark:text-amber-500">
                  <span>🧗</span> Challenges
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {entry.challenges}
                </p>
              </div>
            )}

            {entry.grateful_for && (
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2 text-emerald-600 dark:text-emerald-500">
                  <span>🙏</span> Grateful For
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {entry.grateful_for}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
