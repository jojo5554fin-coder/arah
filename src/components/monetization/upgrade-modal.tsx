"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, Check, Zap, Crown, Sparkles, ArrowRight } from "lucide-react";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  trigger?: string; // context for what triggered the modal
}

const plans = [
  {
    name: "Free",
    icon: Sparkles,
    price: "RM 0",
    period: "forever",
    color: "text-muted-foreground",
    bg: "bg-muted/30",
    border: "border-border",
    features: ["3 habits", "2 goals", "Basic mood tracking", "30-day heatmap"],
    cta: null,
    current: true,
  },
  {
    name: "Pro",
    icon: Zap,
    price: "RM 9",
    period: "/month",
    color: "text-white",
    bg: "bg-primary",
    border: "border-primary",
    features: ["Unlimited habits & goals", "AI Coach", "365-day heatmap", "Full reports", "Social sharing"],
    cta: "Start Pro",
    href: "/signup?plan=pro",
    current: false,
    highlight: true,
  },
  {
    name: "Master",
    icon: Crown,
    price: "RM 99",
    period: "lifetime",
    color: "text-white",
    bg: "bg-gradient-to-br from-amber-500 to-orange-500",
    border: "border-amber-400",
    features: ["Everything in Pro", "Pay once, own forever", "All future features", "Priority support"],
    cta: "Claim Early Bird",
    href: "/signup?plan=master",
    current: false,
    badge: "73 spots left",
  },
];

export function UpgradeModal({ open, onClose, trigger }: UpgradeModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-3xl border-t shadow-2xl max-h-[90vh] overflow-y-auto md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl md:max-w-2xl md:border"
          >
            {/* Handle bar (mobile) */}
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
            </div>

            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Unlock More with Pro</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {trigger === "habits-limit"
                      ? "You've hit your 3-habit limit. Upgrade to add unlimited habits."
                      : trigger === "ai-coach"
                      ? "AI Coach is available on Pro and Master plans."
                      : "Choose a plan that works for your growth journey."}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Plan cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan) => {
                  const Icon = plan.icon;
                  return (
                    <div
                      key={plan.name}
                      className={`relative rounded-2xl border p-5 flex flex-col gap-4 ${plan.border} ${plan.highlight ? plan.bg : "bg-card"}`}
                    >
                      {plan.badge && (
                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-full whitespace-nowrap animate-pulse">
                          ⚡ {plan.badge}
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${plan.highlight || plan.name === "Master" ? "bg-white/20" : "bg-muted"}`}>
                          <Icon className={`h-5 w-5 ${plan.highlight || plan.name === "Master" ? "text-white" : "text-primary"}`} />
                        </div>
                        <div>
                          <p className={`font-bold text-sm ${plan.highlight || plan.name === "Master" ? "text-white" : ""}`}>{plan.name}</p>
                          <p className={`text-xs ${plan.highlight || plan.name === "Master" ? "text-white/70" : "text-muted-foreground"}`}>
                            {plan.current ? "Current plan" : ""}
                          </p>
                        </div>
                      </div>

                      <div>
                        <span className={`text-2xl font-extrabold ${plan.highlight || plan.name === "Master" ? "text-white" : ""}`}>{plan.price}</span>
                        <span className={`text-xs ml-1 ${plan.highlight || plan.name === "Master" ? "text-white/70" : "text-muted-foreground"}`}>{plan.period}</span>
                      </div>

                      <ul className="space-y-1.5">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Check className={`h-3.5 w-3.5 shrink-0 ${plan.highlight || plan.name === "Master" ? "text-white/80" : "text-emerald-500"}`} />
                            <span className={`text-xs ${plan.highlight || plan.name === "Master" ? "text-white/90" : "text-muted-foreground"}`}>{f}</span>
                          </li>
                        ))}
                      </ul>

                      {plan.cta ? (
                        <Link
                          href={plan.href!}
                          onClick={onClose}
                          className={`mt-auto w-full text-center py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 flex items-center justify-center gap-1.5 ${
                            plan.highlight
                              ? "bg-white text-primary"
                              : plan.name === "Master"
                              ? "bg-white/20 text-white border border-white/30 hover:bg-white/30"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          {plan.cta} <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      ) : (
                        <div className="mt-auto w-full text-center py-2.5 rounded-xl text-sm font-medium text-muted-foreground bg-muted/50">
                          Current Plan
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="text-center text-xs text-muted-foreground mt-5">
                🔒 Secure payments via BillPlz · Cancel anytime
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
