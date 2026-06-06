import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Target, Trophy, Heart, BookOpen, Bot, BarChart3, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
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
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Pricing
            </Link>
            <Link href="#about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              About
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
        <section className="relative overflow-hidden pt-24 md:pt-32 lg:pt-40 pb-16 md:pb-24 lg:pb-32">
          <div className="absolute inset-0 bg-hero-gradient -z-10" />
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4 max-w-3xl">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Your Direction to <span className="text-gradient">Personal Growth.</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-lg text-muted-foreground sm:text-xl leading-relaxed">
                  The behavioral intelligence platform that helps you build habits, track goals, and understand yourself without the guilt trips.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link href="/signup" className={buttonVariants({ size: "lg", className: "h-12 px-8 text-base font-medium" })}>
                  Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <p className="text-sm text-muted-foreground sm:hidden mt-2">No credit card required</p>
              </div>
              <p className="hidden sm:block text-sm text-muted-foreground font-medium">No credit card required · Free forever plan available</p>
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section (Conceptual) */}
        <section className="container px-4 md:px-6 pb-24">
          <div className="mx-auto max-w-5xl rounded-xl border bg-card text-card-foreground shadow-xl overflow-hidden glass">
            {/* Fake browser window */}
            <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-warning/60" />
                <div className="h-3 w-3 rounded-full bg-success/60" />
              </div>
            </div>
            {/* Fake dashboard content */}
            <div className="p-6 md:p-8 bg-background/50 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 md:col-span-2 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Today's Habits</h3>
                  <div className="space-y-3">
                    {[
                      { name: "Morning Meditation", cat: "Spiritual", done: true },
                      { name: "Deep Work (2 hrs)", cat: "Career", done: true },
                      { name: "Read 10 pages", cat: "Education", done: false },
                    ].map((h, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-5 w-5 items-center justify-center rounded-sm border ${h.done ? 'bg-primary border-primary text-primary-foreground' : 'border-input'}`}>
                            {h.done && <CheckCircle2 className="h-3.5 w-3.5" />}
                          </div>
                          <span className={h.done ? "line-through text-muted-foreground" : "font-medium"}>{h.name}</span>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">{h.cat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Momentum</h3>
                  <div className="p-4 rounded-lg border bg-card space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-3xl font-bold">12</span>
                      <span className="text-sm font-medium text-success">Level: Sprout 🌱</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary w-[40%]" />
                    </div>
                    <p className="text-xs text-muted-foreground">8 points to next level</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Mood</h3>
                  <div className="p-4 rounded-lg border bg-card">
                     <div className="flex justify-between items-center">
                       <span className="text-2xl">😊</span>
                       <span className="text-sm font-medium">Feeling Good</span>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container px-4 md:px-6 py-16 md:py-24">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Everything you need to grow</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              ARAH combines six powerful tools into one seamless experience designed for the Malaysian lifestyle.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Habits", desc: "Build routines with positive reinforcement, not punishing streaks.", icon: Target, color: "text-blue-500", bg: "bg-blue-500/10" },
              { title: "Goals", desc: "Break big aspirations into achievable milestones and track progress.", icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10" },
              { title: "Mood", desc: "Understand your emotional patterns across 5 key dimensions.", icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10" },
              { title: "Journal", desc: "Develop self-awareness through daily guided reflections.", icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { title: "Reports", desc: "Weekly insights to see exactly how your behavior is trending.", icon: BarChart3, color: "text-indigo-500", bg: "bg-indigo-500/10" },
              { title: "AI Coach", desc: "Personalized behavioral insights based on your unique data.", icon: Bot, color: "text-violet-500", bg: "bg-violet-500/10" },
            ].map((feature, i) => (
              <div key={i} className="feature-card">
                <div className={`feature-icon-wrapper ${feature.bg} ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="border-y bg-muted/30 py-16">
          <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-6">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              🇲🇾 Built in Malaysia
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Join hundreds of Malaysians building better habits</h2>
            <div className="flex items-center justify-center gap-1 text-amber-500 mt-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
              ))}
            </div>
            <p className="text-lg font-medium">"Finally, a growth app that doesn't make me feel guilty when I miss a day."</p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="container px-4 md:px-6 py-24">
          <div className="flex flex-col items-center justify-center p-8 md:p-16 rounded-2xl bg-primary text-primary-foreground text-center overflow-hidden relative">
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
              <p className="text-lg md:text-xl text-primary-foreground/80">
                Join ARAH today and start building the habits that will shape your future.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/signup" className={buttonVariants({ size: "lg", variant: "secondary", className: "h-12 px-8 text-base font-medium" })}>
                  Start Free Trial
                </Link>
                <Link href="/about" className={buttonVariants({ size: "lg", variant: "outline", className: "h-12 px-8 text-base font-medium bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" })}>
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

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
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ARAH. Made in Malaysia 🇲🇾
          </p>
        </div>
      </footer>
    </div>
  );
}
