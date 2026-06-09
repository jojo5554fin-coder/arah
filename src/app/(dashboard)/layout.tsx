import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { FidgetDice } from "@/components/fidget-dice";
import { FloatingUpgradePill } from "@/components/monetization/floating-upgrade-pill";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />
      <div className="flex flex-1 flex-col lg:pl-64">
        <Topbar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">
          <div className="mx-auto max-w-6xl w-full">
            {children}
          </div>
        </main>
        <MobileNav />
      </div>
      <FidgetDice />
      <FloatingUpgradePill />
    </div>
  );
}
