"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, Zap, Crown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface UpgradeBannerProps {
  variant?: "habits-limit" | "habits-warning" | "coach" | "reports" | "heatmap" | "general";
  className?: string;
}

const DISMISS_KEY = "arah-banner-dismissed-at";

function isDismissed(): boolean {
  if (typeof window === "undefined") return false;
  const ts = localStorage.getItem(DISMISS_KEY);
  if (!ts) return false;
  const dismissedAt = parseInt(ts, 10);
  const hours24 = 24 * 60 * 60 * 1000;
  return Date.now() - dismissedAt < hours24;
}

const bannerContent: Record<string, {
  icon: typeof Zap;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  gradient: string;
  iconColor: string;
}> = {
  "habits-limit": {
    icon: Zap,
    title: "You've reached your 3-habit limit",
    subtitle: "Upgrade to Pro for unlimited habits, goals, and AI insights.",
    cta: "Upgrade — RM 9/mo",
    href: "/#pricing",
    gradient: "from-blue-500/10 via-primary/5 to-transparent",
    iconColor: "text-blue-500",
  },
  "habits-warning": {
    icon: Zap,
    title: "Using 2 of 3 free habits",
    subtitle: "You're almost at your limit. Go Pro for unlimited habits.",
    cta: "Go Pro",
    href: "/#pricing",
    gradient: "from-amber-500/10 via-amber-400/5 to-transparent",
    iconColor: "text-amber-500",
  },
  "heatmap": {
    icon: Zap,
    title: "Unlock your full year heatmap",
    subtitle: "Free plan shows 30 days. Pro unlocks 365-day history.",
    cta: "Unlock 365 days",
    href: "/#pricing",
    gradient: "from-indigo-500/10 via-primary/5 to-transparent",
    iconColor: "text-indigo-500",
  },
  "coach": {
    icon: Crown,
    title: "AI Coach is a Pro feature",
    subtitle: "Get personalized behavioral insights powered by AI.",
    cta: "Unlock AI Coach",
    href: "/#pricing",
    gradient: "from-violet-500/10 via-purple-400/5 to-transparent",
    iconColor: "text-violet-500",
  },
  "reports": {
    icon: Zap,
    title: "Your full weekly report is ready",
    subtitle: "Upgrade to Pro to unlock detailed behavioral analytics.",
    cta: "View Full Report",
    href: "/#pricing",
    gradient: "from-emerald-500/10 via-teal-400/5 to-transparent",
    iconColor: "text-emerald-500",
  },
  "general": {
    icon: Crown,
    title: "⚡ Early Bird — 73 spots left",
    subtitle: "Get lifetime access to ARAH for just RM 99. Price goes up after launch.",
    cta: "Claim Lifetime Access",
    href: "/#pricing",
    gradient: "from-orange-500/10 via-amber-400/5 to-transparent",
    iconColor: "text-orange-500",
  },
};

export function UpgradeBanner({ variant = "general", className }: UpgradeBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!isDismissed());
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setVisible(false);
  };

  const content = bannerContent[variant];
  const Icon = content.icon;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "relative rounded-2xl border bg-gradient-to-r p-4 flex items-center gap-4 overflow-hidden",
            content.gradient,
            className
          )}
        >
          {/* Icon */}
          <div className={cn("shrink-0 h-10 w-10 rounded-xl bg-background/80 border flex items-center justify-center", content.iconColor)}>
            <Icon className="h-5 w-5" />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold leading-tight">{content.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{content.subtitle}</p>
          </div>

          {/* CTA */}
          <Link
            href={content.href}
            className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold bg-primary text-primary-foreground px-3 py-2 rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap shadow-sm"
          >
            {content.cta}
            <ArrowRight className="h-3 w-3" />
          </Link>

          {/* Dismiss */}
          <button
            onClick={handleDismiss}
            className="shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
