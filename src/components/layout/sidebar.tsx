"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { mainNavItems, secondaryNavItems } from "@/config/navigation";
import { Target, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <aside className="hidden border-r-2 border-foreground bg-muted/20 lg:flex w-64 flex-col fixed inset-y-0 z-20">
      <div className="flex h-16 items-center border-b-2 border-foreground px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm border-2 border-foreground bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_var(--foreground)]">
            <Target className="h-4 w-4" />
          </div>
          <span className="text-sm font-press-start tracking-tighter mt-0.5">ARAH</span>
        </Link>
      </div>

      <div className="flex-1 overflow-auto py-6 px-4 flex flex-col gap-6">
        <nav className="grid gap-1">
          <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 font-press-start">
            Main
          </div>
          {mainNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.disabled ? "#" : item.href}
                className={cn(
                  "flex items-center gap-3 rounded-sm px-3 py-2 text-sm font-semibold transition-all border-2 border-transparent",
                  isActive
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  item.disabled && "cursor-not-allowed opacity-50"
                )}
                onClick={(e) => item.disabled && e.preventDefault()}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "")} />
                {item.title}
                {item.badge && (
                  <span className="ml-auto rounded-sm bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground font-press-start">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <nav className="grid gap-1 mt-auto">
          <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 font-press-start">
            Account
          </div>
          {secondaryNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-sm px-3 py-2 text-sm font-semibold transition-all border-2 border-transparent",
                  isActive
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="border-t-2 border-foreground p-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-foreground border-transparent hover:border-transparent shadow-none hover:shadow-none active:translate-y-0"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Log out
        </Button>
      </div>
    </aside>
  );
}
