"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Target, Trophy, Heart, BookOpen, Bot, BarChart3, ArrowRight, CheckCircle2 } from "lucide-react";
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
    transition: { staggerChildren: 0.2 }
  }
};

export default function LandingPage() {
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
            <Link href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Features
            </Link>
            <Link href="#benefits" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Benefits
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hidden md:block hover:underline underline-offset-4">
              Log in
            </Link>
            <Link href="/signup" className={buttonVariants()}>
              Start Free
            </Link>
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
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp} className="space-y-4 max-w-2xl">
                  <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                    Your Direction to <br className="hidden lg:block"/>
                    <span className="text-gradient">Personal Growth.</span>
                  </h1>
                  <p className="max-w-[600px] text-lg text-muted-foreground sm:text-xl leading-relaxed mx-auto lg:mx-0">
                    The behavioral intelligence platform that helps you build habits, track goals, and understand yourself without the guilt trips.
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
                  {/* Dynamic Island */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-foreground/10 rounded-full z-20" />
                  
                  {/* Mockup Content */}
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

                {/* Decorative Elements behind phone */}
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
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold bg-background">
                🧠 Backed by Behavioral Science
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold tracking-tight">
                90% of users build consistency without the guilt of broken streaks.
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-muted-foreground">
                Unlike traditional habit trackers that punish you for missing a day, ARAH uses a Momentum Score. We measure your baseline consistency over 140 days. Missing a day is just data, not a failure.
              </motion.p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
            >
              {[
                { title: "No Streak Anxiety", text: "Momentum replaces fragile streaks. A missed day won't reset your progress to zero." },
                { title: "Eye-Level Data", text: "See your behavioral heatmaps at a glance. Understand your high and low energy days." },
                { title: "Emotional Baseline", text: "Track 5 dimensions of mood (Stress, Focus, Energy, etc) to find correlations with habits." }
              ].map((benefit, i) => (
                <motion.div key={i} variants={fadeInUp} className="p-6 rounded-2xl bg-card border shadow-sm">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-xl">
                    {i === 0 ? '🧘' : i === 1 ? '📊' : '❤️'}
                  </div>
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
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Everything you need to grow</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              ARAH combines six powerful tools into one seamless experience designed for the modern lifestyle.
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
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

        {/* Final CTA */}
        <section className="container px-4 md:px-6 pb-24">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="flex flex-col items-center justify-center p-8 md:p-16 rounded-3xl bg-primary text-primary-foreground text-center overflow-hidden relative shadow-2xl"
          >
            {/* Background decoration */}
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
                Join ARAH today and start building the habits that will shape your future.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/signup" className={buttonVariants({ size: "lg", variant: "secondary", className: "h-14 px-8 text-base font-bold rounded-full" })}>
                  Start Free Trial
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
