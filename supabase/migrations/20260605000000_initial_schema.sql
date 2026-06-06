-- ==========================================
-- ARAH - Behavioral Intelligence Platform
-- Initial Database Schema & RLS Policies
-- ==========================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. Custom Enums
-- ==========================================

CREATE TYPE habit_category AS ENUM (
  'fitness', 'health', 'education', 'career', 'business', 
  'finance', 'spiritual', 'relationships', 'custom'
);

CREATE TYPE habit_frequency AS ENUM (
  'daily', 'weekdays', 'weekends', 'weekly', 'custom'
);

CREATE TYPE goal_status AS ENUM (
  'active', 'completed', 'paused', 'archived'
);

CREATE TYPE growth_level AS ENUM (
  'seedling', 'sprout', 'sapling', 'tree', 'forest'
);

CREATE TYPE age_range AS ENUM (
  '18-24', '25-30', '31-35', '36-40', '41-45', '46-50', '50+'
);

CREATE TYPE education_level AS ENUM (
  'secondary', 'diploma', 'bachelor', 'master', 'doctorate', 'other'
);

CREATE TYPE consent_status AS ENUM (
  'pending', 'granted', 'revoked'
);

-- ==========================================
-- 2. Tables
-- ==========================================

-- 2.1 User Profiles (Extends Supabase Auth)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  age_range age_range,
  occupation TEXT,
  industry TEXT,
  education_level education_level,
  timezone TEXT DEFAULT 'Asia/Kuala_Lumpur',
  preferred_language TEXT DEFAULT 'en',
  
  -- App State
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_step INTEGER DEFAULT 1,
  
  -- Gamification
  momentum_score INTEGER DEFAULT 0,
  growth_level growth_level DEFAULT 'seedling',
  total_habits_completed INTEGER DEFAULT 0,
  total_reflections INTEGER DEFAULT 0,
  longest_momentum_days INTEGER DEFAULT 0,
  
  -- Privacy & Consent (PDPA)
  privacy_consent consent_status DEFAULT 'pending',
  privacy_consent_date TIMESTAMPTZ,
  data_processing_consent BOOLEAN DEFAULT false,
  analytics_consent BOOLEAN DEFAULT false,
  marketing_consent BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 2.2 User Settings
CREATE TABLE public.user_settings (
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE PRIMARY KEY,
  theme TEXT DEFAULT 'system',
  accent_color TEXT DEFAULT 'indigo',
  compact_mode BOOLEAN DEFAULT false,
  
  -- Notifications
  habit_reminders BOOLEAN DEFAULT true,
  weekly_report_notification BOOLEAN DEFAULT true,
  mood_reminder BOOLEAN DEFAULT true,
  mood_reminder_time TIME DEFAULT '20:00',
  marketing_emails BOOLEAN DEFAULT false,
  
  -- Data Privacy
  data_export_requested BOOLEAN DEFAULT false,
  data_export_requested_at TIMESTAMPTZ,
  account_deletion_requested BOOLEAN DEFAULT false,
  account_deletion_requested_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.3 Goals
CREATE TABLE public.goals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category habit_category NOT NULL,
  target_date DATE,
  status goal_status DEFAULT 'active',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 2.4 Goal Milestones
CREATE TABLE public.goal_milestones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_date DATE,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  sort_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.5 Habits
CREATE TABLE public.habits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category habit_category NOT NULL,
  frequency habit_frequency DEFAULT 'daily',
  custom_days INTEGER[] DEFAULT '{}', -- 0=Sun, 1=Mon, etc.
  reminder_time TIME,
  color TEXT DEFAULT '#4f46e5',
  icon TEXT DEFAULT 'target',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ
);

-- 2.6 Habit Completions
CREATE TABLE public.habit_completions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  completed_date DATE NOT NULL, -- For easier querying
  notes TEXT,
  
  -- Analytics fields (populated via trigger)
  completed_hour INTEGER,
  completed_day_of_week INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate completions per day per habit
  UNIQUE(habit_id, completed_date)
);

-- 2.7 Mood Entries
CREATE TABLE public.mood_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  entry_date DATE NOT NULL,
  
  -- 1-10 Scale
  stress INTEGER CHECK (stress >= 1 AND stress <= 10),
  happiness INTEGER CHECK (happiness >= 1 AND happiness <= 10),
  focus INTEGER CHECK (focus >= 1 AND focus <= 10),
  energy INTEGER CHECK (energy >= 1 AND energy <= 10),
  motivation INTEGER CHECK (motivation >= 1 AND motivation <= 10),
  
  notes TEXT,
  
  -- Analytics
  entry_hour INTEGER,
  entry_day_of_week INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, entry_date)
);

-- 2.8 Reflections (Journal)
CREATE TABLE public.reflections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  entry_date DATE NOT NULL,
  
  went_well TEXT,
  challenges TEXT,
  grateful_for TEXT,
  
  mood_entry_id UUID REFERENCES public.mood_entries(id) ON DELETE SET NULL,
  
  -- AI Generated (Phase 2)
  sentiment_score NUMERIC(3,2),
  themes TEXT[],
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, entry_date)
);

-- 2.9 Weekly Reports
CREATE TABLE public.weekly_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  
  consistency_score INTEGER,
  momentum_score INTEGER,
  
  habit_performance JSONB,
  goal_progress JSONB,
  mood_trends JSONB,
  
  ai_summary TEXT,
  top_insight TEXT,
  recommendations TEXT[],
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, week_start)
);

-- ==========================================
-- 3. Row Level Security (RLS) Policies
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reports ENABLE ROW LEVEL SECURITY;

-- 3.1 User Profiles Policies
CREATE POLICY "Users can view their own profile" 
ON public.user_profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.user_profiles FOR UPDATE USING (auth.uid() = id);

-- 3.2 User Settings Policies
CREATE POLICY "Users can view their own settings" 
ON public.user_settings FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" 
ON public.user_settings FOR UPDATE USING (auth.uid() = user_id);

-- 3.3 Goals Policies
CREATE POLICY "Users can manage their own goals" 
ON public.goals FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own goal milestones" 
ON public.goal_milestones FOR ALL USING (auth.uid() = user_id);

-- 3.4 Habits Policies
CREATE POLICY "Users can manage their own habits" 
ON public.habits FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own habit completions" 
ON public.habit_completions FOR ALL USING (auth.uid() = user_id);

-- 3.5 Tracking Policies
CREATE POLICY "Users can manage their own mood entries" 
ON public.mood_entries FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own reflections" 
ON public.reflections FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own weekly reports" 
ON public.weekly_reports FOR SELECT USING (auth.uid() = user_id);

-- ==========================================
-- 4. Database Triggers & Functions
-- ==========================================

-- 4.1 Update 'updated_at' timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_goal_milestones_updated_at BEFORE UPDATE ON public.goal_milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_habits_updated_at BEFORE UPDATE ON public.habits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mood_entries_updated_at BEFORE UPDATE ON public.mood_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reflections_updated_at BEFORE UPDATE ON public.reflections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4.2 New User Setup Trigger
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user profile
  INSERT INTO public.user_profiles (id, full_name, avatar_url)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'), NEW.raw_user_meta_data->>'avatar_url');
  
  -- Create default user settings
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 4.3 Habit Completion Analytics Enrichment
CREATE OR REPLACE FUNCTION enrich_habit_completion()
RETURNS TRIGGER AS $$
BEGIN
  NEW.completed_hour = EXTRACT(HOUR FROM NEW.completed_at);
  -- 0 = Sunday, 1 = Monday, etc
  NEW.completed_day_of_week = EXTRACT(DOW FROM NEW.completed_date);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enrich_habit_completion_before_insert
  BEFORE INSERT ON public.habit_completions
  FOR EACH ROW EXECUTE FUNCTION enrich_habit_completion();

-- 4.4 Mood Entry Analytics Enrichment
CREATE OR REPLACE FUNCTION enrich_mood_entry()
RETURNS TRIGGER AS $$
BEGIN
  NEW.entry_hour = EXTRACT(HOUR FROM NEW.created_at);
  NEW.entry_day_of_week = EXTRACT(DOW FROM NEW.entry_date);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enrich_mood_entry_before_insert
  BEFORE INSERT ON public.mood_entries
  FOR EACH ROW EXECUTE FUNCTION enrich_mood_entry();

-- ==========================================
-- 5. Indexes for Performance
-- ==========================================

CREATE INDEX idx_habits_user_id ON public.habits(user_id);
CREATE INDEX idx_habits_active ON public.habits(user_id) WHERE is_active = true AND archived_at IS NULL;
CREATE INDEX idx_habit_completions_user_id ON public.habit_completions(user_id);
CREATE INDEX idx_habit_completions_habit_id ON public.habit_completions(habit_id);
CREATE INDEX idx_habit_completions_date ON public.habit_completions(completed_date);
CREATE INDEX idx_goals_user_id ON public.goals(user_id);
CREATE INDEX idx_goal_milestones_goal_id ON public.goal_milestones(goal_id);
CREATE INDEX idx_mood_entries_user_date ON public.mood_entries(user_id, entry_date);
CREATE INDEX idx_reflections_user_date ON public.reflections(user_id, entry_date);
CREATE INDEX idx_weekly_reports_user_date ON public.weekly_reports(user_id, week_start);
