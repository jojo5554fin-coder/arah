"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { mobileNavItems } from "@/config/navigation";

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
              "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className={cn(
              "flex items-center justify-center p-1 rounded-full transition-all",
              isActive ? "bg-primary/10" : "transparent"
            )}>
              <item.icon className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-medium">{item.title}</span>
          </Link>
        );
      })}
    </div>
  );
}
