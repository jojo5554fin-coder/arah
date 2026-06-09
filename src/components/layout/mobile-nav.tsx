"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { mobileNavItems } from "@/config/navigation";
import { motion } from "framer-motion";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background/80 backdrop-blur-xl lg:hidden pb-safe">
      {mobileNavItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-col items-center justify-center w-full h-full gap-1 transition-colors z-10",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="mobile-nav-indicator"
                className="absolute inset-0 mx-auto my-1 w-12 rounded-full bg-primary/10 -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <item.icon className={cn("transition-all duration-300", isActive ? "h-6 w-6" : "h-5 w-5")} />
            <span className={cn("text-[10px] font-medium transition-all", isActive ? "opacity-100 font-bold" : "opacity-80")}>{item.title}</span>
          </Link>
        );
      })}
    </div>
  );
}
