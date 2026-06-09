"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Zap, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureLockProps {
  title: string;
  description: string;
  icon?: typeof Lock;
  variant?: "pro" | "master";
  previewContent?: React.ReactNode;
  className?: string;
}

export function FeatureLock({
  title,
  description,
  icon: Icon = Lock,
  variant = "pro",
  previewContent,
  className,
}: FeatureLockProps) {
  const isPro = variant === "pro";

  return (
    <div className={cn("relative rounded-3xl overflow-hidden", className)}>
      {/* Blurred preview behind the lock */}
      {previewContent && (
        <div className="pointer-events-none select-none blur-sm opacity-40 saturate-50">
          {previewContent}
        </div>
      )}

      {/* Lock overlay */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center",
        previewContent ? "bg-background/60 backdrop-blur-sm" : "min-h-[320px] relative bg-muted/30 border-2 border-dashed rounded-3xl flex items-center justify-center"
      )}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
          className="flex flex-col items-center text-center p-8 max-w-sm mx-auto"
        >
          {/* Icon */}
          <div className={cn(
            "h-20 w-20 rounded-3xl flex items-center justify-center mb-6 shadow-xl",
            isPro
              ? "bg-gradient-to-br from-primary to-blue-600 text-white"
              : "bg-gradient-to-br from-amber-500 to-orange-500 text-white"
          )}>
            {isPro ? <Zap className="h-10 w-10" /> : <Crown className="h-10 w-10" />}
          </div>

          {/* Text */}
          <h3 className="text-xl font-bold tracking-tight mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">{description}</p>

          {/* Pricing teaser */}
          <div className="w-full space-y-3 mb-6">
            <div className={cn(
              "rounded-2xl p-4 border text-left",
              isPro ? "border-primary/20 bg-primary/5" : "border-amber-500/20 bg-amber-500/5"
            )}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-sm">{isPro ? "Pro Plan" : "Master — Early Bird"}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isPro ? "Unlimited everything + AI Coach" : "Lifetime access, pay once"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-lg">
                    {isPro ? "RM 9" : "RM 99"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isPro ? "/month" : "one-time"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-2 w-full">
            <Link
              href="/#pricing"
              className={cn(
                "w-full text-center py-3 px-6 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg",
                isPro
                  ? "bg-primary text-primary-foreground shadow-primary/20"
                  : "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/20"
              )}
            >
              {isPro ? "Upgrade to Pro" : "Claim Lifetime Access"}
            </Link>
            <Link
              href="/#pricing"
              className="w-full text-center py-2 px-6 rounded-2xl font-medium text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              View all plans →
            </Link>
          </div>

          {/* Early bird scarcity for master */}
          {!isPro && (
            <p className="text-xs text-red-500 font-medium mt-3">
              ⚡ Only 73 early bird spots remaining
            </p>
          )}
        </motion.div>
      </div>

      {/* If no preview, render as a standalone block */}
      {!previewContent && (
        <div className="min-h-[380px]" />
      )}
    </div>
  );
}
