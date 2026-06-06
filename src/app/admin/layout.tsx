import { ReactNode } from "react";
import Link from "next/link";
import { Compass, Users, BarChart3, Settings, ArrowLeft } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r bg-white dark:bg-slate-900 hidden md:block">
        <div className="p-6 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white border-b">
          <Compass className="h-6 w-6 text-primary" />
          ARAH Admin
        </div>
        <nav className="p-4 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-md text-sm font-medium text-slate-900 dark:text-white">
            <BarChart3 className="h-4 w-4" />
            Overview
          </Link>
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-md">
            <Users className="h-4 w-4" />
            Users
          </Link>
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-md">
            <Settings className="h-4 w-4" />
            Platform Settings
          </Link>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-md">
            <ArrowLeft className="h-4 w-4" />
            Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
