import {
  LayoutDashboard,
  Target,
  Trophy,
  Heart,
  BookOpen,
  BarChart3,
  Bot,
  Settings,
  User,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  disabled?: boolean;
  external?: boolean;
}

export const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Habits",
    href: "/habits",
    icon: Target,
  },
  {
    title: "Goals",
    href: "/goals",
    icon: Trophy,
  },
  {
    title: "Mood",
    href: "/mood",
    icon: Heart,
  },
  {
    title: "Journal",
    href: "/journal",
    icon: BookOpen,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    title: "AI Coach",
    href: "/coach",
    icon: Bot,
  },
];

export const secondaryNavItems: NavItem[] = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
];

// Mobile bottom nav - max 5 items
export const mobileNavItems: NavItem[] = [
  {
    title: "Home",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Habits",
    href: "/habits",
    icon: Target,
  },
  {
    title: "Mood",
    href: "/mood",
    icon: Heart,
  },
  {
    title: "Journal",
    href: "/journal",
    icon: BookOpen,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
];
