import { Target } from "lucide-react";
import Link from "next/link";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden bg-muted/30">
      {/* Brand Header (Minimalist) */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Target className="h-4 w-4" />
          </div>
          <span className="text-xl font-bold tracking-tight">ARAH</span>
        </Link>
      </div>

      {/* Main Onboarding Container */}
      <div className="w-full max-w-2xl bg-card border shadow-xl rounded-2xl overflow-hidden relative z-10 animate-fade-in">
        {children}
      </div>
    </div>
  );
}
