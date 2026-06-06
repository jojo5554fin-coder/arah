import { ChatInterface } from "@/components/coach/chat-interface";
import { Bot, Sparkles } from "lucide-react";

export const metadata = {
  title: "AI Coach | ARAH",
  description: "Your behavioral intelligence coach.",
};

export default function CoachPage() {
  return (
    <div className="space-y-8 animate-fade-in pb-10 max-w-5xl mx-auto">
      <div className="page-header">
        <div>
          <h2 className="page-title flex items-center gap-2">
            <Bot className="h-8 w-8 text-primary" />
            AI Coach
          </h2>
          <p className="page-subtitle">Your personalized guide to behavioral consistency and growth.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <ChatInterface />
        </div>
        
        <div className="space-y-6">
          <div className="bg-muted/30 rounded-2xl p-6 border border-primary/10">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-purple-500" />
              What can ARAH do?
            </h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <strong>Review your week:</strong> Analyze your habit consistency and goal progress.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <strong>Find patterns:</strong> Discover how your mood relates to your daily activities.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <strong>Rebuild momentum:</strong> Get actionable, non-judgmental advice on how to recover from a slip-up.
              </li>
            </ul>
          </div>
          
          <div className="bg-blue-500/10 rounded-2xl p-6 border border-blue-500/20 text-sm text-blue-700 dark:text-blue-300">
            <strong>Privacy Note:</strong> The AI Coach only analyzes your habits, goals, and reflections. It does not provide medical advice or diagnoses.
          </div>
        </div>
      </div>
    </div>
  );
}
