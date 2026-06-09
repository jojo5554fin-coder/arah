"use client";

import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Download, Loader2, Target } from "lucide-react";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ShareDialogProps {
  title: string;
  subtitle: string;
  metrics: { label: string; value: string | number }[];
  trigger?: React.ReactElement;
  theme?: "ocean" | "sunset" | "forest" | "amethyst";
}

export function ShareDialog({ 
  title, 
  subtitle, 
  metrics, 
  trigger,
  theme = "ocean" 
}: ShareDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [format, setFormat] = useState<"story" | "post">("story");
  const cardRef = useRef<HTMLDivElement>(null);

  const themeGradients = {
    ocean: "from-blue-600 via-teal-500 to-emerald-400",
    sunset: "from-orange-500 via-rose-500 to-purple-600",
    forest: "from-emerald-600 via-green-500 to-lime-400",
    amethyst: "from-violet-600 via-fuchsia-500 to-pink-500",
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    
    setIsGenerating(true);
    try {
      // Small delay to ensure any fonts/animations are loaded
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = await toPng(cardRef.current, { 
        quality: 1, 
        pixelRatio: 3, // High-res for social sharing
        cacheBust: true,
      });

      // Try native share (Mobile/Supported Browsers)
      if (navigator.canShare && navigator.share) {
        try {
          const blob = await (await fetch(dataUrl)).blob();
          const file = new File([blob], 'arah-milestone.png', { type: 'image/png' });
          
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'My ARAH Progress',
              text: 'Look at my progress on ARAH! 🚀',
              files: [file]
            });
            toast.success("Shared successfully!");
            setIsGenerating(false);
            return;
          }
        } catch (e: any) {
          if (e.name !== "AbortError") {
            console.error("Native share failed:", e);
          } else {
             // User cancelled
             setIsGenerating(false);
             return;
          }
        }
      }

      // Fallback: Download
      const link = document.createElement("a");
      link.download = `arah-${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Image downloaded successfully!");
      
    } catch (err) {
      console.error("Error generating image:", err);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" /> Share
          </Button>
        )}
      >
        <Share2 className="h-4 w-4" />
        <span className="sr-only">Share Progress</span>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md border-0 p-0 overflow-hidden bg-background">
        <div className="p-6 pb-4">
          <DialogHeader>
            <DialogTitle>Share Your Progress</DialogTitle>
            <DialogDescription>
              Inspire others by sharing your consistency on Instagram or Threads.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex gap-2 mt-4 bg-muted p-1 rounded-lg">
            <button 
              onClick={() => setFormat("story")}
              className={cn("flex-1 py-1.5 text-xs font-medium rounded-md transition-colors", format === "story" ? "bg-background shadow-sm" : "text-muted-foreground")}
            >
              IG Story (9:16)
            </button>
            <button 
              onClick={() => setFormat("post")}
              className={cn("flex-1 py-1.5 text-xs font-medium rounded-md transition-colors", format === "post" ? "bg-background shadow-sm" : "text-muted-foreground")}
            >
              Post (4:5)
            </button>
          </div>
        </div>

        {/* The Card to be exported */}
        <div className="p-6 bg-muted/30 flex justify-center items-center overflow-hidden">
          <div 
            ref={cardRef}
            className={cn(
              "relative w-full rounded-3xl p-8 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300",
              format === "story" ? "max-w-[280px] aspect-[9/16]" : "max-w-[340px] aspect-[4/5]",
              "bg-gradient-to-br",
              themeGradients[theme]
            )}
          >
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-black/10 blur-2xl" />
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/30">
                <Target className="h-8 w-8 text-white" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-white tracking-tight drop-shadow-sm">{title}</h3>
                <p className="text-white/90 font-medium">{subtitle}</p>
              </div>
            </div>

            <div className="relative z-10 grid gap-3 w-full">
              {metrics.map((metric, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/10"
                >
                  <span className="text-white/80 text-sm font-medium">{metric.label}</span>
                  <span className="text-white font-bold text-lg">{metric.value}</span>
                </div>
              ))}
            </div>
            
            <div className="relative z-10 pt-6 flex items-center justify-center gap-2 text-white/70">
              <Target className="h-4 w-4" />
              <span className="text-xs font-semibold tracking-widest uppercase">ARAH</span>
            </div>
          </div>
        </div>

        <div className="p-6 pt-4 flex flex-col gap-3">
          <Button 
            onClick={handleShare} 
            disabled={isGenerating}
            className="w-full text-base py-6 rounded-xl font-semibold shadow-lg"
          >
            {isGenerating ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...</>
            ) : (
              <><Share2 className="mr-2 h-5 w-5" /> Share to Socials</>
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            {typeof navigator !== "undefined" && 'share' in navigator
              ? "Will open your device's share menu."
              : "Image will be downloaded to your device."}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
