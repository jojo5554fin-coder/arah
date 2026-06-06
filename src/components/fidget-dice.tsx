"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Hand } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Define the 6 faces and their default 3D rotations
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
  
  // Motion values for 3D rotation
  const rotateX = useMotionValue(30);
  const rotateY = useMotionValue(45);
  
  // Add a spring so dragging feels physical
  const springX = useSpring(rotateX, { damping: 20, stiffness: 100 });
  const springY = useSpring(rotateY, { damping: 20, stiffness: 100 });

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([15, 30, 15, 30, 50]);
    }

    // Spin randomly multiple times before landing
    const randomX = Math.floor(Math.random() * 4) * 90 + 720; // At least 2 full spins
    const randomY = Math.floor(Math.random() * 4) * 90 + 720;
    
    rotateX.set(rotateX.get() + randomX);
    rotateY.set(rotateY.get() + randomY);

    setTimeout(() => {
      setIsRolling(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-50">
      <Popover>
        <Tooltip>
          <TooltipTrigger 
            render={
              <PopoverTrigger 
                render={
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-10 w-10 md:h-12 md:w-12 rounded-full shadow-lg border-2 border-primary/20 bg-background hover:bg-muted"
                  >
                    <Hand className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    <span className="sr-only">Open Fidget Toy</span>
                  </Button>
                }
              />
            }
          />
          <TooltipContent side="left">
            <p>Need a moment? Fidget here.</p>
          </TooltipContent>
        </Tooltip>

        <PopoverContent 
          sideOffset={16} 
          align="end" 
          className="w-64 p-6 rounded-3xl shadow-2xl border-border/50 bg-background/95 backdrop-blur-md"
        >
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="text-center space-y-1">
              <h4 className="font-semibold text-lg tracking-tight">3D Fidget Dice</h4>
              <p className="text-xs text-muted-foreground">
                Drag to spin. Tap to roll.
              </p>
            </div>

            {/* 3D Scene Container */}
            <div 
              className="w-32 h-32 flex items-center justify-center" 
              style={{ perspective: "600px" }}
            >
              <motion.div
                className="relative w-20 h-20 cursor-grab active:cursor-grabbing"
                style={{
                  transformStyle: "preserve-3d",
                  rotateX: springX,
                  rotateY: springY,
                }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.6}
                onDrag={(e, info) => {
                  // Translate drag distance to rotation
                  rotateX.set(rotateX.get() - info.delta.y);
                  rotateY.set(rotateY.get() + info.delta.x);
                }}
                onClick={rollDice}
              >
                {/* Render the 6 faces of the cube */}
                {faces.map((face) => {
                  const Icon = face.Icon;
                  return (
                    <div
                      key={face.id}
                      className="absolute inset-0 border-2 border-primary/40 bg-muted/90 rounded-xl flex items-center justify-center shadow-inner backdrop-blur-sm"
                      style={{
                        transform: face.transform,
                        backfaceVisibility: "hidden"
                      }}
                    >
                      <Icon className="h-12 w-12 text-primary drop-shadow-md" strokeWidth={2} />
                    </div>
                  );
                })}
              </motion.div>
            </div>
            
            <p className="text-[10px] text-muted-foreground pt-2 text-center">
              (Haptic feedback works on supported devices)
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
