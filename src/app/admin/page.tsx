import { Users, Target, Heart, ArrowUp, Activity, BarChart3, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Admin Dashboard | ARAH",
  description: "Platform analytics and overview",
};

export default function AdminDashboardPage() {
  return (
    <div className="p-8 space-y-8 animate-fade-in max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Platform Overview</h1>
        <p className="text-slate-500 mt-2">Key metrics and behavioral data across all users.</p>
      </div>

      {/* Top Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground flex items-center text-green-500 mt-1">
              <ArrowUp className="h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Habits</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,832</div>
            <p className="text-xs text-muted-foreground flex items-center text-green-500 mt-1">
              <ArrowUp className="h-3 w-3 mr-1" />
              4.6 per user average
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mood Entries</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,593</div>
            <p className="text-xs text-muted-foreground flex items-center text-green-500 mt-1">
              <ArrowUp className="h-3 w-3 mr-1" />
              +8% this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Retention</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">64%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Day 30 retention rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Engagement Analytics */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Habit Completion by Category
            </CardTitle>
            <CardDescription>Platform-wide completion rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Fitness</span>
                  <span className="text-muted-foreground">78%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: "78%" }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Career / Work</span>
                  <span className="text-muted-foreground">82%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: "82%" }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Spiritual</span>
                  <span className="text-muted-foreground">64%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: "64%" }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Education</span>
                  <span className="text-muted-foreground">45%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500" style={{ width: "45%" }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Global Mood Trends */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Global Average Mood
            </CardTitle>
            <CardDescription>Aggregated from all active users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/50">
                  <div className="text-sm font-medium text-orange-800 dark:text-orange-300">Avg Stress</div>
                  <div className="text-2xl font-bold mt-1 text-orange-600 dark:text-orange-400">4.2<span className="text-sm font-normal">/10</span></div>
                </div>
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/50">
                  <div className="text-sm font-medium text-green-800 dark:text-green-300">Avg Happiness</div>
                  <div className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">6.8<span className="text-sm font-normal">/10</span></div>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50">
                  <div className="text-sm font-medium text-blue-800 dark:text-blue-300">Avg Focus</div>
                  <div className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">6.1<span className="text-sm font-normal">/10</span></div>
                </div>
                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/50">
                  <div className="text-sm font-medium text-purple-800 dark:text-purple-300">Avg Motivation</div>
                  <div className="text-2xl font-bold mt-1 text-purple-600 dark:text-purple-400">6.5<span className="text-sm font-normal">/10</span></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
