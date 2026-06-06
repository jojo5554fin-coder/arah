"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface VolumeDialProps {
  value: number; // 1 to 10
  onChange: (value: number) => void;
  colorClass?: string;
}

export function VolumeDial({ value, onChange, colorClass = "text-primary" }: VolumeDialProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Constants for geometry (Smaller for mobile)
  const RADIUS = 90;
  const STROKE_WIDTH = 14;
  const CENTER_X = RADIUS + STROKE_WIDTH;
  const CENTER_Y = RADIUS + STROKE_WIDTH;
  
  const arcLength = Math.PI * RADIUS;
  
  // Value goes from 1 to 10
  // Calculate percentage (0 to 1)
  const percentage = (value - 1) / 9;

  // The thumb angle goes from 180 (left) to 0 (right) degrees.
  const angleDeg = 180 - (percentage * 180);
  const angleRad = (angleDeg * Math.PI) / 180;

  // Calculate thumb coordinates
  const thumbX = CENTER_X + RADIUS * Math.cos(angleRad);
  const thumbY = CENTER_Y - RADIUS * Math.sin(angleRad);

  const calculateValueFromEvent = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    const x = clientX - rect.left - CENTER_X;
    const y = clientY - rect.top - CENTER_Y;

    // Calculate angle in radians
    let angle = Math.atan2(-y, x); // -y because y goes down on screen
    if (angle < 0) {
      angle += 2 * Math.PI;
    }

    // Clamp angle to 0 - PI
    if (angle > Math.PI && angle < 1.5 * Math.PI) {
      angle = Math.PI; // Clamp to left
    } else if (angle >= 1.5 * Math.PI || angle < 0) {
      angle = 0; // Clamp to right
    }

    // Convert angle to percentage (PI = 0%, 0 = 100%)
    const pct = 1 - (angle / Math.PI);
    
    // Convert to 1-10 scale
    const rawVal = 1 + (pct * 9);
    const snappedVal = Math.max(1, Math.min(10, Math.round(rawVal)));
    
    if (snappedVal !== value) {
      onChange(snappedVal);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    calculateValueFromEvent(e.clientX, e.clientY);
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      calculateValueFromEvent(e.clientX, e.clientY);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove, { passive: false });
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerUp);
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [isDragging, value]); // added value to deps so the closure captures latest onChange if needed (though it shouldn't matter with stable onChange)

  const getEmoji = (val: number): string => {
    if (val <= 2) return "😔";
    if (val <= 4) return "😐";
    if (val <= 6) return "🙂";
    if (val <= 8) return "😊";
    return "🤩";
  };

  return (
    <div 
      className="relative flex flex-col items-center select-none touch-none md:scale-125 md:mt-4 md:mb-6 transition-transform"
      ref={containerRef}
      onPointerDown={handlePointerDown}
      style={{ touchAction: "none" }} // crucial for preventing scroll on mobile
    >
      <div className="relative">
        <svg 
          width={CENTER_X * 2} 
          height={CENTER_Y} // Only render top half
          className="overflow-visible drop-shadow-sm"
        >
          {/* Background Track Arc */}
          <path
            d={`M ${STROKE_WIDTH} ${CENTER_Y} A ${RADIUS} ${RADIUS} 0 0 1 ${CENTER_X * 2 - STROKE_WIDTH} ${CENTER_Y}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            className="text-muted/30"
          />

          {/* Fill Arc */}
          <path
            d={`M ${STROKE_WIDTH} ${CENTER_Y} A ${RADIUS} ${RADIUS} 0 0 1 ${CENTER_X * 2 - STROKE_WIDTH} ${CENTER_Y}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            className={cn("transition-all duration-100 ease-out", colorClass)}
            style={{
              strokeDasharray: arcLength,
              strokeDashoffset: arcLength - (arcLength * percentage),
            }}
          />

          {/* Draggable Thumb Handle */}
          <g style={{ transform: `translate(${thumbX}px, ${thumbY}px)`, transition: isDragging ? 'none' : 'transform 0.1s ease-out' }}>
            <circle 
              r={STROKE_WIDTH * 1.2} 
              fill="currentColor" 
              className={cn("bg-background cursor-grab active:cursor-grabbing shadow-md", colorClass)}
            />
            <circle 
              r={STROKE_WIDTH * 0.8} 
              fill="hsl(var(--background))" 
            />
          </g>
        </svg>

        {/* Center Display */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pb-2 pointer-events-none">
          <motion.div 
            key={value}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-black tabular-nums tracking-tighter"
            style={{ color: "var(--foreground)" }}
          >
            {value}
          </motion.div>
          <div className="text-2xl mt-0.5 opacity-90">{getEmoji(value)}</div>
        </div>
      </div>
      
      {/* Min/Max Labels */}
      <div className="w-full flex justify-between mt-2 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
}
