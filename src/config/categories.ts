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

export interface CategoryConfig {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  textColor: string;
}

export const categoryConfig: Record<HabitCategory, CategoryConfig> = {
  fitness: {
    label: "Fitness",
    icon: "💪",
    color: "#10b981",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-600 dark:text-emerald-400",
  },
  health: {
    label: "Health",
    icon: "🍎",
    color: "#22c55e",
    bgColor: "bg-green-500/10",
    textColor: "text-green-600 dark:text-green-400",
  },
  education: {
    label: "Education",
    icon: "📚",
    color: "#3b82f6",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  career: {
    label: "Career",
    icon: "💼",
    color: "#6366f1",
    bgColor: "bg-indigo-500/10",
    textColor: "text-indigo-600 dark:text-indigo-400",
  },
  business: {
    label: "Business",
    icon: "📈",
    color: "#8b5cf6",
    bgColor: "bg-violet-500/10",
    textColor: "text-violet-600 dark:text-violet-400",
  },
  finance: {
    label: "Finance",
    icon: "💰",
    color: "#f59e0b",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-600 dark:text-amber-400",
  },
  spiritual: {
    label: "Spiritual",
    icon: "🕊️",
    color: "#a78bfa",
    bgColor: "bg-purple-400/10",
    textColor: "text-purple-500 dark:text-purple-400",
  },
  relationships: {
    label: "Relationships",
    icon: "❤️",
    color: "#f43f5e",
    bgColor: "bg-rose-500/10",
    textColor: "text-rose-600 dark:text-rose-400",
  },
  custom: {
    label: "Custom",
    icon: "⭐",
    color: "#64748b",
    bgColor: "bg-slate-500/10",
    textColor: "text-slate-600 dark:text-slate-400",
  },
};

export const categoryList = Object.entries(categoryConfig).map(
  ([key, config]) => ({
    value: key as HabitCategory,
    ...config,
  })
);
