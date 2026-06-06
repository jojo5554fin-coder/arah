// ============================================
// ARAH Database Types
// Mirrors the PostgreSQL schema exactly
// ============================================

export type HabitCategory =
  | "fitness"
  | "health"
  | "education"
  | "career"
  | "business"
  | "finance"
  | "spiritual"
  | "relationships"
  | "custom";

export type HabitFrequency =
  | "daily"
  | "weekdays"
  | "weekends"
  | "weekly"
  | "custom";

export type GoalStatus = "active" | "completed" | "paused" | "archived";

export type GrowthLevel =
  | "seedling"
  | "sprout"
  | "sapling"
  | "tree"
  | "forest";

export type AgeRange =
  | "18-24"
  | "25-30"
  | "31-35"
  | "36-40"
  | "41-45"
  | "46-50"
  | "50+";

export type EducationLevel =
  | "secondary"
  | "diploma"
  | "bachelor"
  | "master"
  | "doctorate"
  | "other";

export type ConsentStatus = "pending" | "granted" | "revoked";

// ============================================
// Table Types
// ============================================

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  age_range: AgeRange | null;
  occupation: string | null;
  industry: string | null;
  education_level: EducationLevel | null;
  timezone: string;
  preferred_language: string;
  onboarding_completed: boolean;
  onboarding_step: number;
  momentum_score: number;
  growth_level: GrowthLevel;
  total_habits_completed: number;
  total_reflections: number;
  longest_momentum_days: number;
  privacy_consent: ConsentStatus;
  privacy_consent_date: string | null;
  data_processing_consent: boolean;
  analytics_consent: boolean;
  marketing_consent: boolean;
  created_at: string;
  updated_at: string;
  last_active_at: string;
  deleted_at: string | null;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  custom_days: number[];
  reminder_time: string | null;
  color: string;
  icon: string;
  is_active: boolean;
  sort_order: number;
  goal_id: string | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
  // Joined data
  habit_completions?: HabitCompletion[];
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  user_id: string;
  completed_at: string;
  completed_date: string;
  notes: string;
  completed_hour: number;
  completed_day_of_week: number;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: HabitCategory;
  target_date: string | null;
  status: GoalStatus;
  progress: number;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  // Joined data
  goal_milestones?: GoalMilestone[];
}

export interface GoalMilestone {
  id: string;
  goal_id: string;
  user_id: string;
  title: string;
  description: string;
  target_date: string | null;
  is_completed: boolean;
  completed_at: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface MoodEntry {
  id: string;
  user_id: string;
  entry_date: string;
  stress: number;
  happiness: number;
  focus: number;
  energy: number;
  motivation: number;
  notes: string;
  entry_hour: number;
  entry_day_of_week: number;
  created_at: string;
  updated_at: string;
}

export interface Reflection {
  id: string;
  user_id: string;
  entry_date: string;
  went_well: string;
  challenges: string;
  grateful_for: string;
  mood_entry_id: string | null;
  sentiment_score: number | null;
  themes: string[] | null;
  created_at: string;
  updated_at: string;
  // Joined data
  mood_entries?: MoodEntry;
}

export interface WeeklyReport {
  id: string;
  user_id: string;
  week_start: string;
  week_end: string;
  consistency_score: number;
  momentum_score: number;
  habit_performance: HabitPerformance[];
  goal_progress: GoalProgressItem[];
  mood_trends: MoodTrends;
  ai_summary: string | null;
  top_insight: string | null;
  recommendations: string[] | null;
  created_at: string;
}

export interface HabitPerformance {
  habit_id: string;
  name: string;
  completed: number;
  expected: number;
  rate: number;
}

export interface GoalProgressItem {
  goal_id: string;
  title: string;
  progress_delta?: number;
  current_progress: number;
}

export interface MoodTrends {
  averages: {
    stress: number;
    happiness: number;
    focus: number;
    energy: number;
    motivation: number;
  };
  entries_count: number;
  best_day?: string;
  worst_day?: string;
}

export interface UserSettings {
  user_id: string;
  theme: "light" | "dark" | "system";
  accent_color: string;
  compact_mode: boolean;
  habit_reminders: boolean;
  weekly_report_notification: boolean;
  mood_reminder: boolean;
  mood_reminder_time: string;
  marketing_emails: boolean;
  data_export_requested: boolean;
  data_export_requested_at: string | null;
  account_deletion_requested: boolean;
  account_deletion_requested_at: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// Insert / Update Types (for forms)
// ============================================

export type HabitInsert = Omit<
  Habit,
  "id" | "user_id" | "created_at" | "updated_at" | "archived_at" | "habit_completions"
>;

export type HabitUpdate = Partial<HabitInsert>;

export type GoalInsert = Omit<
  Goal,
  "id" | "user_id" | "created_at" | "updated_at" | "completed_at" | "goal_milestones"
>;

export type GoalUpdate = Partial<GoalInsert>;

export type MilestoneInsert = Omit<
  GoalMilestone,
  "id" | "user_id" | "created_at" | "updated_at" | "completed_at"
>;

export type MoodInsert = Omit<
  MoodEntry,
  "id" | "user_id" | "entry_hour" | "entry_day_of_week" | "created_at" | "updated_at"
>;

export type ReflectionInsert = Omit<
  Reflection,
  "id" | "user_id" | "sentiment_score" | "themes" | "created_at" | "updated_at" | "mood_entries"
>;
