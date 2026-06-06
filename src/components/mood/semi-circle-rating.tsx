"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SemiCircleRatingProps {
  value: number; // 1 to 5
  onChange: (value: number) => void;
  colorClass?: string;
}

export function SemiCircleRating({ value, onChange, colorClass = "bg-primary" }: SemiCircleRatingProps) {
  // 5 points on a semi-circle (0 to 180 degrees)
  // Angles in degrees: 180 (left), 135, 90 (top), 45, 0 (right)
  const buttons = [
    { val: 1, angle: 180, label: "Low" },
    { val: 2, angle: 145, label: "" }, // adjusted slightly to spread them nicely
    { val: 3, angle: 90, label: "Med" },
    { val: 4, angle: 35, label: "" },
    { val: 5, angle: 0, label: "High" },
  ];

  // Container dimensions
  const RADIUS = 110; 
  const CENTER_X = RADIUS;
  const CENTER_Y = RADIUS; // Bottom center
  
  // Convert angle to X/Y relative to top-left of container
  const getPosition = (angleDeg: number) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    // X = center + R * cos(theta), Y = center - R * sin(theta) (minus because Y goes down)
    const x = CENTER_X + RADIUS * Math.cos(angleRad);
    const y = CENTER_Y - RADIUS * Math.sin(angleRad);
    return { x, y };
  };

  return (
    <div className="relative mx-auto flex justify-center" style={{ width: RADIUS * 2 + 40, height: RADIUS + 40 }}>
      {/* The invisible arc container */}
      <div 
        className="relative"
        style={{ width: RADIUS * 2, height: RADIUS }}
      >
        {/* Draw a subtle SVG dashed arc behind the buttons */}
        <svg 
          className="absolute inset-0 pointer-events-none opacity-20 text-muted-foreground" 
          width={RADIUS * 2} 
          height={RADIUS * 2} // Double height to draw full circle but we only see top half
          style={{ overflow: 'visible' }}
        >
          <path 
            d={`M 0 ${RADIUS} A ${RADIUS} ${RADIUS} 0 0 1 ${RADIUS * 2} ${RADIUS}`}
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeDasharray="6 6"
          />
        </svg>

        {buttons.map((btn) => {
          const { x, y } = getPosition(btn.angle);
          const isSelected = value === btn.val;

          return (
            <motion.button
              key={btn.val}
              onClick={() => onChange(btn.val)}
              // Position the center of the button exactly on the x,y coordinate
              style={{ left: x, top: y, position: 'absolute', transform: 'translate(-50%, -50%)' }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              initial={false}
              animate={{
                scale: isSelected ? 1.25 : 1,
              }}
              className={cn(
                "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm md:text-base transition-colors shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 z-10 border-2",
                isSelected 
                  ? cn("text-white border-transparent", colorClass)
                  : "bg-background text-muted-foreground border-muted hover:border-foreground/30 hover:text-foreground"
              )}
              aria-label={`Rate ${btn.val} out of 5`}
            >
              {btn.val}
              
              {/* Optional labels for min/mid/max */}
              {btn.label && (
                <span className="absolute -bottom-6 text-[10px] text-muted-foreground whitespace-nowrap font-medium tracking-wider uppercase">
                  {btn.label}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
