"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Hand, Settings2, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const faces = [
  { id: 1, Icon: Dice1, transform: "rotateY(0deg) translateZ(40px)" },
  { id: 2, Icon: Dice2, transform: "rotateY(180deg) translateZ(40px)" },
  { id: 3, Icon: Dice3, transform: "rotateY(-90deg) translateZ(40px)" },
  { id: 4, Icon: Dice4, transform: "rotateY(90deg) translateZ(40px)" },
  { id: 5, Icon: Dice5, transform: "rotateX(90deg) translateZ(40px)" },
  { id: 6, Icon: Dice6, transform: "rotateX(-90deg) translateZ(40px)" },
];

export function FidgetDice() {
  const [isRolling, setIsRolling] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Settings State
  const [haptics, setHaptics] = useState(true);
  const [shape, setShape] = useState<"cube" | "sphere">("cube");
  const [color, setColor] = useState("primary");
  
  // Load settings from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("arah-fidget-settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHaptics(parsed.haptics ?? true);
        setShape(parsed.shape ?? "cube");
        setColor(parsed.color ?? "primary");
      } catch (e) {}
    }
  }, []);

  // Save settings when changed
  useEffect(() => {
    localStorage.setItem("arah-fidget-settings", JSON.stringify({ haptics, shape, color }));
  }, [haptics, shape, color]);
  
  const rotateX = useMotionValue(30);
  const rotateY = useMotionValue(45);
  const springX = useSpring(rotateX, { damping: 20, stiffness: 100 });
  const springY = useSpring(rotateY, { damping: 20, stiffness: 100 });

  const getColorClass = () => {
    if (color === "emerald") return "text-emerald-500 border-emerald-500/40";
    if (color === "rose") return "text-rose-500 border-rose-500/40";
    if (color === "amber") return "text-amber-500 border-amber-500/40";
    if (color === "indigo") return "text-indigo-500 border-indigo-500/40";
    return "text-primary border-primary/40";
  };

  const getBgClass = () => {
    if (color === "emerald") return "bg-emerald-500/10";
    if (color === "rose") return "bg-rose-500/10";
    if (color === "amber") return "bg-amber-500/10";
    if (color === "indigo") return "bg-indigo-500/10";
    return "bg-primary/10";
  };

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);

    if (haptics && typeof navigator !== "undefined" && navigator.vibrate) {
      // Subtle click vibration first
      navigator.vibrate(15);
      // Then roll rumble
      setTimeout(() => navigator.vibrate([15, 30, 15, 30, 50]), 50);
    }

    const randomX = Math.floor(Math.random() * 4) * 90 + 720;
    const randomY = Math.floor(Math.random() * 4) * 90 + 720;
    
    rotateX.set(rotateX.get() + randomX);
    rotateY.set(rotateY.get() + randomY);

    setTimeout(() => {
      setIsRolling(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-50">
      <Popover onOpenChange={(open) => !open && setShowSettings(false)}>
        <Tooltip>
          <TooltipTrigger render={<PopoverTrigger render={<Button variant="outline" size="icon" className={cn("h-10 w-10 md:h-12 md:w-12 rounded-full shadow-lg border-2 border-primary/20 bg-background hover:bg-muted", getBgClass(), getColorClass().split(' ')[0])}><Hand className="h-4 w-4 md:h-5 md:w-5" /><span className="sr-only">Open Fidget Toy</span></Button>} />} />
          <TooltipContent side="left"><p>Need a moment? Fidget here.</p></TooltipContent>
        </Tooltip>

        <PopoverContent sideOffset={16} align="end" className="w-72 p-0 rounded-3xl shadow-2xl border-border/50 bg-background/95 backdrop-blur-md overflow-hidden">
          {showSettings ? (
            <div className="p-6 space-y-6 animate-in slide-in-from-right-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-lg tracking-tight">Settings</h4>
                <Button variant="ghost" size="icon" className="-mr-2" onClick={() => setShowSettings(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="haptics" className="flex flex-col gap-1">
                    <span>Haptic Feedback</span>
                    <span className="font-normal text-xs text-muted-foreground">Vibrate on tap and roll</span>
                  </Label>
                  <Switch id="haptics" checked={haptics} onCheckedChange={setHaptics} />
                </div>

                <div className="space-y-2">
                  <Label>Shape</Label>
                  <RadioGroup value={shape} onValueChange={(v) => setShape(v as any)} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cube" id="s-cube" />
                      <Label htmlFor="s-cube" className="font-normal">Cube</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sphere" id="s-sphere" />
                      <Label htmlFor="s-sphere" className="font-normal">Sphere</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Color Theme</Label>
                  <div className="flex gap-3">
                    {["primary", "emerald", "rose", "amber", "indigo"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={cn(
                          "w-8 h-8 rounded-full border-2 transition-all",
                          color === c ? "border-foreground scale-110 shadow-sm" : "border-transparent hover:scale-105"
                        )}
                        style={{
                          backgroundColor: c === 'primary' ? 'var(--primary)' : `var(--${c}-500, ${c === 'emerald' ? '#10b981' : c === 'rose' ? '#f43f5e' : c === 'amber' ? '#f59e0b' : '#6366f1'})`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 flex flex-col items-center justify-center space-y-6 animate-in slide-in-from-left-4">
              <div className="w-full flex justify-between items-start">
                <div className="opacity-0 w-8" /> {/* spacer */}
                <div className="text-center space-y-1">
                  <h4 className="font-semibold text-lg tracking-tight">3D Fidget</h4>
                  <p className="text-xs text-muted-foreground">Drag to spin. Tap to roll.</p>
                </div>
                <Button variant="ghost" size="icon" className="-mt-2 -mr-2 text-muted-foreground" onClick={() => setShowSettings(true)}>
                  <Settings2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="w-32 h-32 flex items-center justify-center" style={{ perspective: "600px" }}>
                <motion.div
                  className="relative w-20 h-20 cursor-grab active:cursor-grabbing"
                  style={{ transformStyle: "preserve-3d", rotateX: springX, rotateY: springY }}
                  drag dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} dragElastic={0.6}
                  onDrag={(e, info) => {
                    rotateX.set(rotateX.get() - info.delta.y);
                    rotateY.set(rotateY.get() + info.delta.x);
                  }}
                  onClick={rollDice}
                >
                  {faces.map((face) => {
                    const Icon = face.Icon;
                    return (
                      <div
                        key={face.id}
                        className={cn(
                          "absolute inset-0 border-2 bg-background/90 flex items-center justify-center shadow-inner backdrop-blur-sm transition-all duration-300",
                          getColorClass(),
                          shape === "sphere" ? "rounded-full" : "rounded-xl"
                        )}
                        style={{ transform: face.transform, backfaceVisibility: "hidden" }}
                      >
                        <Icon className="h-12 w-12 drop-shadow-md" strokeWidth={2} />
                      </div>
                    );
                  })}
                </motion.div>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
