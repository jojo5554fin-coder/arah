"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Target, Trophy, Heart, BookOpen, Bot, BarChart3, ArrowRight, Check, X, Zap, Crown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const fadeInUp: any = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const pricingTiers = [
  {
    name: "Free",
    icon: Sparkles,
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Start your growth journey with no commitment.",
    cta: "Get Started Free",
    ctaHref: "/signup",
    ctaVariant: "outline" as const,
    highlight: false,
    badge: null,
    features: [
      { label: "Up to 3 habits", included: true },
      { label: "Up to 2 goals", included: true },
      { label: "Mood tracking", included: true },
      { label: "Journal (3 entries/week)", included: true },
      { label: "30-day heatmap view", included: true },
      { label: "Basic weekly summary", included: true },
      { label: "AI Coach", included: false },
      { label: "Yearly heatmap (365 days)", included: false },
      { label: "Social sharing templates", included: false },
      { label: "Full Fidget Dice customization", included: false },
      { label: "Priority support", included: false },
    ]
  },
  {
    name: "Pro",
    icon: Zap,
    monthlyPrice: 19.90,
    annualPrice: 159,
    description: "For serious growers who want unlimited access and AI insights.",
    cta: "Start Pro",
    ctaHref: "/signup?plan=pro",
    ctaVariant: "default" as const,
    highlight: true,
    badge: "Most Popular",
    features: [
      { label: "Unlimited habits", included: true },
      { label: "Unlimited goals", included: true },
      { label: "Mood tracking", included: true },
      { label: "Unlimited journal entries", included: true },
      { label: "365-day yearly heatmap", included: true },
      { label: "Full weekly behavioral reports", included: true },
      { label: "AI Coach with insights", included: true },
      { label: "Social sharing templates", included: true },
      { label: "All Fidget Dice shapes & colors", included: true },
      { label: "Priority support", included: false },
      { label: "All future features", included: false },
    ]
  },
  {
    name: "Master",
    icon: Crown,
    monthlyPrice: null,
    annualPrice: null,
    lifetimePrice: 599,
    description: "Pay once. Own forever. Includes every future feature we ever ship.",
    cta: "Get Lifetime Access",
    ctaHref: "/signup?plan=master",
    ctaVariant: "default" as const,
    highlight: false,
    badge: "Best Value",
    features: [
      { label: "Everything in Pro", included: true },
      { label: "Lifetime access — pay once", included: true },
      { label: "All future features included", included: true },
      { label: "Priority support & feedback", included: true },
      { label: "Early access to beta features", included: true },
      { label: "Founding member badge", included: true },
      { label: "Direct line to founders", included: true },
      { label: "Unlimited habits & goals", included: true },
      { label: "AI Coach — forever", included: true },
      { label: "365-day heatmap", included: true },
      { label: "Social sharing templates", included: true },
    ]
  }
];

export default function LandingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Target className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">ARAH</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Features</Link>
            <Link href="#benefits" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Benefits</Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hidden md:block hover:underline underline-offset-4">Log in</Link>
            <Link href="/signup" className={buttonVariants()}>Start Free</Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24">
          <div className="absolute inset-0 bg-hero-gradient -z-10" />
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Text CTA */}
              <motion.div 
                className="flex flex-col items-center lg:items-start space-y-8 text-center lg:text-left"
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp} className="space-y-4 max-w-2xl">
                  <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                    Your Direction to <br className="hidden lg:block"/>
                    <span className="text-gradient">Personal Growth.</span>
                  </h1>
                  <p className="max-w-[600px] text-lg text-muted-foreground sm:text-xl leading-relaxed mx-auto lg:mx-0">
                    The behavioral intelligence platform that helps you build habits, track goals, and understand yourself — without the guilt trips.
                  </p>
                </motion.div>
                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Link href="/signup" className={buttonVariants({ size: "lg", className: "h-14 px-8 text-base font-medium rounded-full shadow-lg shadow-primary/20" })}>
                    Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </motion.div>
                <motion.p variants={fadeInUp} className="text-sm text-muted-foreground font-medium">
                  No credit card required · Free forever plan available
                </motion.p>
              </motion.div>

              {/* Right Column: 3D Mobile Mockup */}
              <motion.div 
                className="relative flex justify-center lg:justify-end"
                initial={{ opacity: 0, y: 100, rotateY: 20 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                style={{ perspective: "1000px" }}
              >
                <div className="relative w-[300px] h-[600px] rounded-[3rem] border-[10px] border-foreground/10 bg-background shadow-2xl overflow-hidden ring-1 ring-border z-10 flex flex-col">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-foreground/10 rounded-full z-20" />
                  <div className="flex-1 p-5 pt-12 flex flex-col gap-6 bg-muted/20 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/20" />
                      <div className="h-8 w-24 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">Level 12 🌱</div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-muted rounded" />
                      <div className="h-8 w-48 bg-foreground/10 rounded" />
                    </div>
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-16 w-full bg-card rounded-xl border flex items-center px-4 gap-3 shadow-sm">
                          <div className={cn("h-6 w-6 rounded-md border-2", i === 1 ? "bg-primary border-primary" : "border-muted-foreground")} />
                          <div className="space-y-1.5 flex-1">
                            <div className="h-2.5 w-24 bg-foreground/20 rounded" />
                            <div className="h-2 w-16 bg-muted rounded" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-auto h-24 w-full bg-card rounded-xl border flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />
                      <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    </div>
                  </div>
                </div>
                <div className="absolute top-1/4 -right-12 w-48 h-48 bg-primary/20 blur-3xl rounded-full -z-10" />
                <div className="absolute bottom-1/4 -left-12 w-48 h-48 bg-rose-500/20 blur-3xl rounded-full -z-10" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Benefits & Case Study */}
        <section id="benefits" className="border-y bg-muted/30 py-20 overflow-hidden">
          <div className="container px-4 md:px-6">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold bg-background">
                🧠 Backed by Behavioral Science
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold tracking-tight">
                Build consistency without the guilt of broken streaks.
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-muted-foreground">
                Unlike traditional habit trackers that punish you for missing a day, ARAH uses a Momentum Score — measuring your consistency baseline over time. Missing a day is just data, not a failure.
              </motion.p>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
            >
              {[
                { title: "No Streak Anxiety", text: "Momentum replaces fragile streaks. A missed day won't reset your progress to zero.", emoji: "🧘" },
                { title: "Eye-Level Data", text: "See your behavioral heatmaps at a glance. Understand your high and low energy days.", emoji: "📊" },
                { title: "Emotional Baseline", text: "Track 5 dimensions of mood (Stress, Focus, Energy, etc) to find correlations with habits.", emoji: "❤️" }
              ].map((benefit, i) => (
                <motion.div key={i} variants={fadeInUp} className="p-6 rounded-2xl bg-card border shadow-sm">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-xl">{benefit.emoji}</div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="container px-4 md:px-6 py-24">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Everything you need to grow</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Six powerful tools, one seamless experience built for the modern lifestyle.
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              { title: "Habits", desc: "Build routines with positive reinforcement, not punishing streaks.", icon: Target, color: "text-blue-500", bg: "bg-blue-500/10" },
              { title: "Goals", desc: "Break big aspirations into achievable milestones and track progress.", icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10" },
              { title: "Mood", desc: "Understand your emotional patterns across 5 key dimensions.", icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10" },
              { title: "Journal", desc: "Develop self-awareness through daily guided reflections.", icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { title: "Reports", desc: "Weekly insights to see exactly how your behavior is trending.", icon: BarChart3, color: "text-indigo-500", bg: "bg-indigo-500/10" },
              { title: "AI Coach", desc: "Personalized behavioral insights based on your unique data.", icon: Bot, color: "text-violet-500", bg: "bg-violet-500/10" },
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeInUp} className="p-6 rounded-2xl bg-card border transition-all hover:shadow-md hover:-translate-y-1">
                <div className={`h-12 w-12 rounded-xl mb-4 flex items-center justify-center ${feature.bg} ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="border-t bg-muted/20 py-24">
          <div className="container px-4 md:px-6">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="flex flex-col items-center text-center space-y-4 mb-12"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold bg-background">
                🇲🇾 Priced for Malaysia
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Simple, transparent pricing
              </motion.h2>
              <motion.p variants={fadeInUp} className="max-w-[600px] text-muted-foreground md:text-lg">
                Start free. Upgrade when you're ready. No hidden fees.
              </motion.p>

              {/* Annual / Monthly Toggle */}
              <motion.div variants={fadeInUp} className="flex items-center gap-4 mt-4">
                <span className={cn("text-sm font-medium transition-colors", !isAnnual ? "text-foreground" : "text-muted-foreground")}>Monthly</span>
                <button
                  onClick={() => setIsAnnual(!isAnnual)}
                  className={cn(
                    "relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus-visible:outline-none",
                    isAnnual ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                >
                  <span className={cn(
                    "inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                    isAnnual ? "translate-x-8" : "translate-x-1"
                  )} />
                </button>
                <div className="flex items-center gap-2">
                  <span className={cn("text-sm font-medium transition-colors", isAnnual ? "text-foreground" : "text-muted-foreground")}>Annual</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Save 33%
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* Pricing Cards */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start"
            >
              {pricingTiers.map((tier, i) => {
                const TierIcon = tier.icon;
                return (
                  <motion.div
                    key={tier.name}
                    variants={fadeInUp}
                    className={cn(
                      "relative rounded-3xl border p-8 flex flex-col gap-6 transition-all duration-300",
                      tier.highlight
                        ? "border-primary bg-primary text-primary-foreground shadow-2xl shadow-primary/20 md:-mt-4 md:scale-105"
                        : "bg-card hover:shadow-lg"
                    )}
                  >
                    {/* Badge */}
                    {tier.badge && (
                      <div className={cn(
                        "absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-wide",
                        tier.highlight ? "bg-white text-primary" : "bg-amber-500 text-white"
                      )}>
                        {tier.badge}
                      </div>
                    )}

                    {/* Header */}
                    <div className="space-y-3">
                      <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center",
                        tier.highlight ? "bg-white/20" : "bg-primary/10"
                      )}>
                        <TierIcon className={cn("h-6 w-6", tier.highlight ? "text-white" : "text-primary")} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold tracking-tight">{tier.name}</h3>
                        <p className={cn("text-sm mt-1", tier.highlight ? "text-primary-foreground/80" : "text-muted-foreground")}>
                          {tier.description}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div>
                      {tier.lifetimePrice ? (
                        <div>
                          <span className="text-4xl font-extrabold tracking-tight">RM {tier.lifetimePrice}</span>
                          <span className={cn("text-sm ml-2", tier.highlight ? "text-primary-foreground/70" : "text-muted-foreground")}>one-time</span>
                        </div>
                      ) : tier.monthlyPrice === 0 ? (
                        <div>
                          <span className="text-4xl font-extrabold tracking-tight">Free</span>
                          <span className={cn("text-sm ml-2", tier.highlight ? "text-primary-foreground/70" : "text-muted-foreground")}>forever</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-end gap-1">
                            <span className="text-4xl font-extrabold tracking-tight">
                              RM {isAnnual ? Math.round(tier.annualPrice! / 12 * 10) / 10 : tier.monthlyPrice}
                            </span>
                            <span className={cn("text-sm mb-1.5", tier.highlight ? "text-primary-foreground/70" : "text-muted-foreground")}>/month</span>
                          </div>
                          {isAnnual && (
                            <p className={cn("text-xs", tier.highlight ? "text-primary-foreground/70" : "text-muted-foreground")}>
                              Billed RM {tier.annualPrice}/year
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={tier.ctaHref}
                      className={cn(
                        "w-full text-center py-3 px-6 rounded-2xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]",
                        tier.highlight
                          ? "bg-white text-primary hover:bg-white/90 shadow-lg"
                          : tier.name === "Master"
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 shadow-lg shadow-amber-500/20"
                          : "border-2 border-border hover:border-primary hover:text-primary"
                      )}
                    >
                      {tier.cta}
                    </Link>

                    {/* Features List */}
                    <ul className="space-y-3">
                      {tier.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-3">
                          {feature.included ? (
                            <Check className={cn("h-4 w-4 mt-0.5 shrink-0", tier.highlight ? "text-white" : "text-emerald-500")} />
                          ) : (
                            <X className={cn("h-4 w-4 mt-0.5 shrink-0", tier.highlight ? "text-primary-foreground/40" : "text-muted-foreground/40")} />
                          )}
                          <span className={cn(
                            "text-sm",
                            !feature.included && (tier.highlight ? "text-primary-foreground/50" : "text-muted-foreground/50")
                          )}>
                            {feature.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Reassurance note */}
            <motion.p
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center text-sm text-muted-foreground mt-10"
            >
              🔒 No credit card required to start. Cancel anytime. Secure payments via Stripe.
            </motion.p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="container px-4 md:px-6 py-24">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="flex flex-col items-center justify-center p-8 md:p-16 rounded-3xl bg-primary text-primary-foreground text-center overflow-hidden relative shadow-2xl"
          >
            <div className="absolute inset-0 opacity-10">
              <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M0 40V0H40" fill="none" stroke="currentColor" strokeWidth="2" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />
              </svg>
            </div>
            <div className="relative z-10 space-y-6 max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Ready to start your growth journey?</h2>
              <p className="text-lg md:text-xl text-primary-foreground/90">
                Join ARAH today. It's free to start — upgrade only when you're ready.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/signup" className={buttonVariants({ size: "lg", variant: "secondary", className: "h-14 px-8 text-base font-bold rounded-full" })}>
                  Start Free Today
                </Link>
                <Link href="#pricing" className={buttonVariants({ size: "lg", variant: "outline", className: "h-14 px-8 text-base font-bold rounded-full bg-transparent border-white/30 text-white hover:bg-white/10" })}>
                  View Pricing
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-muted/40 py-12">
          <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <span className="font-bold tracking-tight">ARAH</span>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:underline">Privacy</Link>
              <Link href="/terms" className="hover:underline">Terms</Link>
              <Link href="/contact" className="hover:underline">Contact</Link>
            </div>
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} ARAH. Made in Malaysia 🇲🇾</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
