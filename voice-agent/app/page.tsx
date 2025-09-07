"use client";

import { Button } from "@/components/ui/button";
import { RealtimeSession } from "@openai/agents-realtime";
import { createAgent } from "@/agents/aigirlfriend";
import axios from "axios";

export default function Home() {
  const handleStartAgent = async () => {
    console.log("Making API Call to /api/ephemeral-token to EK");
    try {
      // Create the ET
      const response = await axios.get("/api/ephemeral-token");
      console.log(
        `Got the response from /api/ephemeral-token: `,
        response.data
      );

      const tempKey = response.data.tempApiKey;
      console.log("Temp KEY::: ", tempKey)

      // Create the realtime session for ai girlfriend
      const session = new RealtimeSession(await createAgent(), {
        model: "gpt-realtime",
        config: {
          inputAudioFormat: "pcm16",
          inputAudioNoiseReduction: { type: "near_field" },
          inputAudioTranscription: {
            language: "en",
            model: "gpt-4o-mini-transcribe",
          },
        },
      });

      console.log("Session:: ", session)

      // Automatically connects your microphone and audio output in the browser via WebRTC
      await session.connect({ apiKey: tempKey });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Button
            onClick={handleStartAgent}
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            rel="noopener noreferrer"
          >
            Talk to AI Girl Friend Agent
          </Button>
        </div>
      </main>
    </div>
  );
}
