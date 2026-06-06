export const moodDimensions = [
  {
    key: "stress",
    label: "Stress",
    icon: "😤",
    lowLabel: "Calm",
    highLabel: "Overwhelmed",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    sliderColor: "bg-red-500",
    cssClass: "mood-stress",
  },
  {
    key: "happiness",
    label: "Happiness",
    icon: "😊",
    lowLabel: "Low",
    highLabel: "Joyful",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    sliderColor: "bg-amber-500",
    cssClass: "mood-happiness",
  },
  {
    key: "focus",
    label: "Focus",
    icon: "🎯",
    lowLabel: "Scattered",
    highLabel: "Deep Focus",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    sliderColor: "bg-blue-500",
    cssClass: "mood-focus",
  },
  {
    key: "energy",
    label: "Energy",
    icon: "⚡",
    lowLabel: "Drained",
    highLabel: "Energized",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    sliderColor: "bg-green-500",
    cssClass: "mood-energy",
  },
  {
    key: "motivation",
    label: "Motivation",
    icon: "🔥",
    lowLabel: "Uninspired",
    highLabel: "On Fire",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    sliderColor: "bg-purple-500",
    cssClass: "mood-motivation",
  },
] as const;

export type MoodDimensionKey = (typeof moodDimensions)[number]["key"];

export interface MoodEntry {
  id: string;
  stress: number;
  happiness: number;
  focus: number;
  energy: number;
  motivation: number;
  notes: string | null;
  created_at: string;
}
