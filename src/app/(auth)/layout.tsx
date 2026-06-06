import { Target } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Background styling */}
      <div className="absolute inset-0 bg-hero-gradient -z-10" />
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm -z-10" />

      {/* Brand Header */}
      <Link href="/" className="flex items-center gap-2 mb-8 group">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg transition-transform group-hover:scale-105">
          <Target className="h-6 w-6" />
        </div>
        <span className="text-2xl font-bold tracking-tight">ARAH</span>
      </Link>

      {/* Main Form Container */}
      <div className="w-full max-w-md bg-card/80 backdrop-blur-xl border shadow-2xl rounded-2xl p-6 sm:p-10 relative z-10 animate-fade-in">
        {children}
      </div>

      {/* Footer text */}
      <p className="mt-8 text-center text-sm text-muted-foreground max-w-sm">
        By continuing, you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
