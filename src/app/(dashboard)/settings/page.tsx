import { Settings, Bell, Lock, User, Palette } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const metadata = {
  title: "Settings | ARAH",
  description: "Manage your account settings.",
};

export default function SettingsPage() {
  return (
    <div className="space-y-8 animate-fade-in pb-10 max-w-3xl mx-auto">
      <div className="page-header">
        <div>
          <h2 className="page-title flex items-center gap-2">
            <Settings className="h-8 w-8 text-primary" />
            Settings
          </h2>
          <p className="page-subtitle">Manage your account preferences and notifications.</p>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure how and when you want to be notified.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Daily Reminders</div>
                <div className="text-sm text-muted-foreground">Receive a reminder to check in your habits.</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Weekly Reports</div>
                <div className="text-sm text-muted-foreground">Get notified when your weekly report is ready.</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">AI Coach Insights</div>
                <div className="text-sm text-muted-foreground">Receive occasional nudges from ARAH.</div>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>Customize the look and feel of your dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Theme Preferences</div>
                <div className="text-sm text-muted-foreground">This is managed by the theme toggle in the sidebar.</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
