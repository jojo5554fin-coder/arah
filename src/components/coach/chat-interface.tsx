"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content: "Hi! I'm ARAH, your behavioral intelligence coach. 🌟 I'm here to help you review your week, build consistency, and stay motivated. What would you like to reflect on today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      // For MVP we just read the full text response instead of streaming
      const data = await response.text();
      setMessages([...newMessages, { id: (Date.now() + 1).toString(), role: "assistant", content: data }]);
    } catch (err: any) {
      console.error(err);
      setError(new Error(err.message || "Failed to connect to AI Coach."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[600px] border-primary/10 shadow-sm max-w-4xl mx-auto">
      <CardHeader className="bg-muted/30 border-b shrink-0">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          AI Coach
        </CardTitle>
        <CardDescription>
          Ask about your progress, get advice on habits, or reflect on your mood.
        </CardDescription>
      </CardHeader>
      
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-6 pb-4">
          {error && (
             <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm flex items-start gap-2 mb-4">
               <AlertCircle className="h-5 w-5 shrink-0" />
               <span>
                  <strong>Connection Error:</strong> The AI Coach is currently unavailable. 
                  {error.message.includes("API key") 
                    ? " Please ensure your OpenAI API key is configured in your environment."
                    : " " + error.message}
               </span>
             </div>
          )}

          {messages.map(m => (
            <div key={m.id} className={`flex items-start gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                m.role === "user" ? "bg-primary text-primary-foreground" : "bg-purple-500 text-white"
              }`}>
                {m.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
              </div>
              
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                m.role === "user" 
                  ? "bg-primary text-primary-foreground rounded-tr-sm" 
                  : "bg-muted rounded-tl-sm text-foreground prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-pre:bg-primary/5"
              }`}>
                {m.role === "user" ? (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                ) : (
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center shrink-0">
                <Bot className="h-5 w-5" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-sm p-4 flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">ARAH is thinking...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-background shrink-0 rounded-b-xl">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="E.g. I struggled with reading this week, any tips?"
            className="min-h-[60px] max-h-[120px] resize-y bg-muted/50 focus-visible:ring-primary/20"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                const form = e.currentTarget.form;
                if (form) form.requestSubmit();
              }
            }}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="h-full px-4 shrink-0 bg-purple-600 hover:bg-purple-700" 
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
        <p className="text-xs text-center text-muted-foreground mt-3 flex items-center justify-center gap-1">
          <Sparkles className="h-3 w-3" />
          AI-generated insights. Does not provide medical advice.
        </p>
      </div>
    </Card>
  );
}
