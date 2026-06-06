import { User, Mail, Shield, Download, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Profile | ARAH",
  description: "Manage your profile and data privacy.",
};

export default function ProfilePage() {
  return (
    <div className="space-y-8 animate-fade-in pb-10 max-w-3xl mx-auto">
      <div className="page-header">
        <div>
          <h2 className="page-title flex items-center gap-2">
            <User className="h-8 w-8 text-primary" />
            Profile & Privacy
          </h2>
          <p className="page-subtitle">Manage your personal information and data privacy controls.</p>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Details
            </CardTitle>
            <CardDescription>Your basic account information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/20">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                U
              </div>
              <div>
                <div className="font-medium">Current User</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" /> user@example.com
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Update Profile</Button>
              <Button variant="outline">Change Password</Button>
            </div>
          </CardContent>
        </Card>

        {/* Day 19: Data Export & Privacy Controls */}
        <Card className="border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <Shield className="h-5 w-5" />
              Data Privacy & Export (PDPA Compliance)
            </CardTitle>
            <CardDescription>We believe your data belongs to you. Export or delete it at any time.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/50">
              <h4 className="font-medium text-blue-900 dark:text-blue-300 flex items-center gap-2 mb-1">
                <Download className="h-4 w-4" /> Export Your Data
              </h4>
              <p className="text-sm text-blue-700/80 dark:text-blue-400/80 mb-3">
                Download a complete archive of your habits, mood logs, journal entries, and insights in JSON format.
              </p>
              <Button size="sm" variant="secondary" className="bg-white dark:bg-slate-800">
                Request Data Export
              </Button>
            </div>

            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/50">
               <h4 className="font-medium text-red-900 dark:text-red-300 flex items-center gap-2 mb-1">
                <Trash2 className="h-4 w-4" /> Delete Account
              </h4>
              <p className="text-sm text-red-700/80 dark:text-red-400/80 mb-3">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button size="sm" variant="destructive">
                Delete My Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
