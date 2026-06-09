"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export type Plan = "free" | "pro" | "master";

interface Subscription {
  plan: Plan;
  billing_cycle: string | null;
  status: string;
  current_period_end: string | null;
}

interface UseSubscriptionReturn {
  plan: Plan;
  isPro: boolean;
  isMaster: boolean;
  isPaid: boolean;
  isLoading: boolean;
  subscription: Subscription | null;
}

// Cache plan in memory for the session to avoid repeated DB calls
let cachedPlan: Plan | null = null;

export function useSubscription(): UseSubscriptionReturn {
  const [plan, setPlan] = useState<Plan>(cachedPlan ?? "free");
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(!cachedPlan);

  useEffect(() => {
    if (cachedPlan) {
      setIsLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setPlan("free");
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("subscriptions")
          .select("plan, billing_cycle, status, current_period_end")
          .eq("user_id", user.id)
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (error || !data) {
          // No subscription record = free plan
          setPlan("free");
          cachedPlan = "free";
        } else {
          const activePlan = data.plan as Plan;
          setPlan(activePlan);
          cachedPlan = activePlan;
          setSubscription(data);
        }
      } catch {
        setPlan("free");
        cachedPlan = "free";
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  return {
    plan,
    isPro: plan === "pro" || plan === "master",
    isMaster: plan === "master",
    isPaid: plan !== "free",
    isLoading,
    subscription,
  };
}
