import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 30; // Max duration for Serverless functions

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // In a real app we'd block this, but for the MVP demo, allow without user
    const userId = user?.id || "anonymous";

    const { messages } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      // Mock response if no API key is provided
      return new Response(
        JSON.stringify({
          error: "OpenAI API key not configured. The AI Coach is currently running in mock mode.",
          mockResponse: true
        }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    // Call OpenAI
    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages,
      system: `You are ARAH, a supportive behavioral intelligence coach. 
      Your goal is to help the user build consistency, manage their mood, and achieve their goals.
      Do NOT provide medical advice or diagnoses. Always focus on momentum, recovery from slip-ups, and positive reinforcement.
      Keep responses concise, actionable, and formatted in clean markdown. Use emojis sparingly but effectively.
      Avoid shame or punishment messaging (e.g., don't talk about 'breaking streaks', focus on 'getting back on track').`,
    });
    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("AI Coach Error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred while communicating with the AI Coach." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
