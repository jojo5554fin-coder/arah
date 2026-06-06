export interface GrowthLevel {
  name: string;
  label: string;
  icon: string;
  minMomentum: number;
  maxMomentum: number;
  description: string;
}

export const growthLevels: GrowthLevel[] = [
  {
    name: "seedling",
    label: "Seedling",
    icon: "🌱",
    minMomentum: 0,
    maxMomentum: 19,
    description: "Every journey begins with a single step",
  },
  {
    name: "sprout",
    label: "Sprout",
    icon: "🌿",
    minMomentum: 20,
    maxMomentum: 39,
    description: "Your roots are growing stronger",
  },
  {
    name: "sapling",
    label: "Sapling",
    icon: "🌳",
    minMomentum: 40,
    maxMomentum: 59,
    description: "Building resilience and consistency",
  },
  {
    name: "tree",
    label: "Tree",
    icon: "🌲",
    minMomentum: 60,
    maxMomentum: 79,
    description: "Strong, steady, and growing upward",
  },
  {
    name: "forest",
    label: "Forest",
    icon: "🏔️",
    minMomentum: 80,
    maxMomentum: 100,
    description: "You are an ecosystem of growth",
  },
];

export function getGrowthLevel(momentum: number): GrowthLevel {
  return (
    growthLevels.find(
      (level) =>
        momentum >= level.minMomentum && momentum <= level.maxMomentum
    ) || growthLevels[0]
  );
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: {
    type: "habits_completed" | "reflections" | "goals_completed" | "momentum_days";
    count: number;
  };
}

export const milestones: Milestone[] = [
  {
    id: "first_week",
    title: "First Week of Growth",
    description: "Maintained momentum for 7 days",
    icon: "🌟",
    requirement: { type: "momentum_days", count: 7 },
  },
  {
    id: "monthly_momentum",
    title: "Monthly Momentum",
    description: "30 days of consistent growth",
    icon: "🏅",
    requirement: { type: "momentum_days", count: 30 },
  },
  {
    id: "century",
    title: "Century of Action",
    description: "Completed 100 habits",
    icon: "💯",
    requirement: { type: "habits_completed", count: 100 },
  },
  {
    id: "goal_achiever",
    title: "Goal Achiever",
    description: "Completed your first goal",
    icon: "🏆",
    requirement: { type: "goals_completed", count: 1 },
  },
  {
    id: "self_aware",
    title: "Self-Aware Leader",
    description: "Written 30 reflections",
    icon: "🧠",
    requirement: { type: "reflections", count: 30 },
  },
];
