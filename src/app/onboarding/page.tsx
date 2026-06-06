"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { categoryList, type HabitCategory } from "@/config/categories";
import { Loader2, ArrowRight, ArrowLeft, Target, Heart, Leaf } from "lucide-react";

export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [profile, setProfile] = useState({
    ageRange: "",
    occupation: "",
  });

  const [habit, setHabit] = useState({
    name: "",
    category: "" as HabitCategory | "",
  });

  const [mood, setMood] = useState({
    stress: 5,
    happiness: 5,
    energy: 5,
  });

  const totalSteps = 4;

  const nextStep = () => {
    if (step === 2 && (!profile.ageRange || !profile.occupation)) {
      toast.error("Please fill in your profile details");
      return;
    }
    if (step === 3 && (!habit.name || !habit.category)) {
      toast.error("Please set up your first habit");
      return;
    }
    setStep((s) => Math.min(s + 1, totalSteps));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleComplete = async () => {
    setIsSubmitting(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("You must be logged in to complete onboarding");
      router.push("/login");
      return;
    }

    try {
      // 1. Update Profile
      const { error: profileError } = await supabase
        .from("user_profiles")
        .update({
          age_range: profile.ageRange,
          occupation: profile.occupation,
          onboarding_completed: true,
          onboarding_step: 4,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // 2. Insert First Habit
      const { error: habitError } = await supabase
        .from("habits")
        .insert({
          user_id: user.id,
          name: habit.name,
          category: habit.category as HabitCategory,
          frequency: "daily",
        });

      if (habitError) throw habitError;

      // 3. Insert Mood Baseline
      const { error: moodError } = await supabase
        .from("mood_entries")
        .insert({
          user_id: user.id,
          entry_date: new Date().toISOString().split("T")[0],
          stress: mood.stress,
          happiness: mood.happiness,
          energy: mood.energy,
          focus: 5, // default
          motivation: 5, // default
          notes: "Onboarding baseline",
        });

      if (moodError) throw moodError;

      toast.success("Welcome to ARAH! Let's get growing. 🌱");
      router.push("/dashboard");
      router.refresh();
      
    } catch (error: any) {
      console.error("Onboarding error:", error);
      toast.error(error.message || "Something went wrong during setup.");
      
      // Fallback redirect if backend fails due to dummy keys
      if (process.env.NODE_ENV === 'development') {
         toast.info("Local dev mode: Bypassing setup due to DB error.");
         router.push("/dashboard");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      {/* Progress Bar */}
      <div className="h-2 w-full bg-muted">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      <div className="flex-1 p-6 md:p-10">
        {step === 1 && (
          <div className="flex flex-col items-center text-center space-y-6 pt-8 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
              <Leaf className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome to your new beginning.</h1>
            <p className="text-lg text-muted-foreground max-w-md">
              We're going to help you build habits, track goals, and understand yourself without the guilt trips. Let's personalize your experience.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Tell us about yourself</h2>
              <p className="text-muted-foreground">
                This helps our AI coach provide better, more relevant insights later on.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>What is your age range?</Label>
                <Select value={profile.ageRange} onValueChange={(val) => setProfile(p => ({ ...p, ageRange: val || "" }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select age range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18-24">18-24</SelectItem>
                    <SelectItem value="25-30">25-30</SelectItem>
                    <SelectItem value="31-35">31-35</SelectItem>
                    <SelectItem value="36-40">36-40</SelectItem>
                    <SelectItem value="41-45">41-45</SelectItem>
                    <SelectItem value="46-50">46-50</SelectItem>
                    <SelectItem value="50+">50+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 pt-2">
                <Label>What is your primary occupation?</Label>
                <Input 
                  placeholder="e.g. Software Engineer, Student, Entrepreneur" 
                  value={profile.occupation}
                  onChange={(e) => setProfile(p => ({ ...p, occupation: e.target.value }))}
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Plant your first seed</h2>
              <p className="text-muted-foreground">
                Choose one simple habit you want to start building today.
              </p>
            </div>

            <div className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label>Habit Name</Label>
                <Input 
                  placeholder="e.g. Drink a glass of water every morning" 
                  value={habit.name}
                  onChange={(e) => setHabit(h => ({ ...h, name: e.target.value }))}
                  className="text-lg py-6"
                />
              </div>

              <div className="space-y-3">
                <Label>Category</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categoryList.map((cat) => (
                    <div 
                      key={cat.value}
                      onClick={() => setHabit(h => ({ ...h, category: cat.value }))}
                      className={`cursor-pointer rounded-xl border p-3 flex flex-col items-center gap-2 transition-all ${
                        habit.category === cat.value 
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                          : 'hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="text-xs font-medium">{cat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">How are you feeling today?</h2>
              <p className="text-muted-foreground">
                Let's establish a baseline. Be honest—there are no wrong answers.
              </p>
            </div>

            <div className="space-y-8 pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base flex items-center gap-2">
                    <span>😰</span> Stress Level
                  </Label>
                  <span className="font-semibold text-primary">{mood.stress}/10</span>
                </div>
                <Slider 
                  value={[mood.stress]} 
                  min={1} max={10} step={1}
                  onValueChange={(val) => setMood(m => ({ ...m, stress: typeof val === 'number' ? val : val[0] }))}
                  className="[&_[role=slider]]:bg-orange-500"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Very Calm (1)</span>
                  <span>Very Stressed (10)</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base flex items-center gap-2">
                    <span>😊</span> Happiness
                  </Label>
                  <span className="font-semibold text-primary">{mood.happiness}/10</span>
                </div>
                <Slider 
                  value={[mood.happiness]} 
                  min={1} max={10} step={1}
                  onValueChange={(val) => setMood(m => ({ ...m, happiness: typeof val === 'number' ? val : val[0] }))}
                  className="[&_[role=slider]]:bg-yellow-500"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Very Low (1)</span>
                  <span>Very Happy (10)</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base flex items-center gap-2">
                    <span>⚡</span> Energy
                  </Label>
                  <span className="font-semibold text-primary">{mood.energy}/10</span>
                </div>
                <Slider 
                  value={[mood.energy]} 
                  min={1} max={10} step={1}
                  onValueChange={(val) => setMood(m => ({ ...m, energy: typeof val === 'number' ? val : val[0] }))}
                  className="[&_[role=slider]]:bg-green-500"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Drained (1)</span>
                  <span>Energized (10)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="border-t bg-muted/30 p-6 flex items-center justify-between">
        {step > 1 ? (
          <Button variant="ghost" onClick={prevStep} disabled={isSubmitting}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        ) : (
          <div /> // Placeholder for spacing
        )}
        
        {step < totalSteps ? (
          <Button onClick={nextStep}>
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleComplete} disabled={isSubmitting} className="px-8">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Go to Dashboard
          </Button>
        )}
      </div>
    </div>
  );
}
