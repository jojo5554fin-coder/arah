"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TreePine, Sprout, Leaf, TreeDeciduous, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface GamificationData {
  momentum_score: number;
  growth_level: 'seedling' | 'sprout' | 'sapling' | 'tree' | 'forest';
}

const LEVEL_DATA = {
  seedling: { icon: Leaf, label: "Seedling", color: "text-emerald-400", nextScore: 20 },
  sprout: { icon: Sprout, label: "Sprout", color: "text-emerald-500", nextScore: 40 },
  sapling: { icon: TreePine, label: "Sapling", color: "text-green-600", nextScore: 60 },
  tree: { icon: TreeDeciduous, label: "Tree", color: "text-green-700", nextScore: 80 },
  forest: { icon: Activity, label: "Forest", color: "text-emerald-800", nextScore: 100 },
};

export function GamificationWidget() {
  const [data, setData] = useState<GamificationData>({
    momentum_score: 0,
    growth_level: 'seedling'
  });

  useEffect(() => {
    const fetchGamification = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('momentum_score, growth_level')
        .eq('id', user.id)
        .single();

      if (profile) {
        setData(profile as GamificationData);
      } else if (process.env.NODE_ENV === "development") {
        setData({ momentum_score: 35, growth_level: 'sprout' });
      }
    };
    
    fetchGamification();
  }, []);

  const levelInfo = LEVEL_DATA[data.growth_level];
  const Icon = levelInfo.icon;

  return (
    <Card className="bg-gradient-to-br from-emerald-500/5 to-transparent overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-[10px] font-bold flex items-center gap-2 text-muted-foreground uppercase tracking-wider font-press-start">
          <Activity className="h-3 w-3" /> Momentum & Growth
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-sm bg-background border-2 border-foreground flex items-center justify-center shadow-[2px_2px_0px_0px_var(--foreground)] ${levelInfo.color}`}>
              <Icon className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Level</p>
              <p className={`text-xs md:text-sm font-bold font-press-start uppercase tracking-tighter ${levelInfo.color}`}>{levelInfo.label}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl md:text-2xl font-bold font-press-start text-emerald-500 tracking-tighter">{data.momentum_score}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">XP Score</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wide font-press-start">
            <span>Next Level</span>
            <span>{data.momentum_score} / {levelInfo.nextScore} XP</span>
          </div>
          <Progress value={(data.momentum_score / levelInfo.nextScore) * 100} />
        </div>
      </CardContent>
    </Card>
  );
}
