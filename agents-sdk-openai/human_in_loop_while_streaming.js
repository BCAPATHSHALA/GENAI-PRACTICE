import "dotenv/config";
import { Agent, run } from "@openai/agents";

const agent = new Agent({
  name: "Storyteller",
  instructions:
    "You are a storyteller. You will be given a topic and you will tell a story about it.",
});

let stream = await run(
  agent,
  "What is the weather in San Francisco and Oakland?",
  { stream: true }
);
stream.toTextStream({ compatibleWithNodeStreams: true }).pipe(process.stdout);
await stream.completed;

// Human-in-the-loop: Approve or reject tool calls
console.log("\n\n\n stream.interruptions:", stream.interruptions);
while (stream.interruptions?.length) {
  console.log(
    "Human-in-the-loop: approval required for the following tool calls:"
  );
  const state = stream.state;
  for (const interruption of stream.interruptions) {
    const approved = confirm(
      `Agent ${interruption.agent.name} would like to use the tool ${interruption.rawItem.name} with "${interruption.rawItem.arguments}". Do you approve?`
    );
    if (approved) {
      state.approve(interruption);
    } else {
      state.reject(interruption);
    }
  }

  // Resume execution with streaming output
  stream = await run(agent, state, { stream: true });
  const textStream = stream.toTextStream({ compatibleWithNodeStreams: true });
  textStream.pipe(process.stdout);
  await stream.completed;
}

/*
Certainly! Here's a quick story about the weather in San Francisco and Oakland:

---

Once upon a recent afternoon, the cities of San Francisco and Oakland were like two slightly different personalities sharing a bay.

In San Francisco, the famous fog named Karl was feeling a little lazy. He lounged just offshore, sending wisps along the coastline. Downtown, it was cool and breezy, a gentle 61°F, perfect for a light hoodie. Residents bustled along the Embarcadero, their cheeks tinged pink from the crisp air.

A bridge away, Oakland basked under clearer skies. Sunshine poured over Lake Merritt, and the air held a comfortable warmth, about 68°F. Families picnicked while street musicians played jazz, and the late afternoon light made everything glow golden.

Despite sharing the same patch of the world, these two neighbors wore different weather, as they often do. But in both cities, the people looked up and smiled, enjoying the day in their own unique ways.

---

If you want a real-time weather update, let me know!
 stream.interruptions: []
PS E:\DEV ECOSYSTEM\GENAI PROJECTS\genai practice\agents-sdk-openai> node human_in_loop_while_streaming.js
Certainly, but before we begin the story, here’s a brief check-in: As of my last update, I cannot provide real-time weather. For the most current weather, please check a live source. 

Now, let’s turn this into a story:

---

**The Tale of the Twin Cities’ Sky**

Once upon a time, in the Bay where the fog danced and the sun tiptoed, San Francisco and Oakland were like siblings separated by a sparkling bridge.

In San Francisco, mornings often began with a cloak of silvery fog—Misty, the gentle spirit, loved to paint the city in veils that curled through the streets and over the steep hills. She would linger just long enough for the scent of the sea to fill every alley, before the sun, with its golden brush, swept her away by lunchtime.

Across the bay, sturdy Oakland would rise to the day with a bit more sunshine. While Misty played in San Francisco, Oakland greeted the Sun early, claiming a warm patchwork of blue skies and gentle breezes. Occasionally, Misty would float over the water for a brief visit—never overstaying, for Oakland preferred open skies and warm afternoons.

Some days, the wind (called Zephyr), feeling mischievous, would chase Misty across both cities, surprising everyone with sudden whispers of chill or gusts that rustled redwoods and city parks alike. Yet every night, both cities would gather under a soft, cool blanket, sharing the Bay’s peace.

And thus, every day in San Francisco and Oakland is a gentle dance of fog, sun, wind, and warmth—a story told not once, but every day, ever changing, ever enchanting.

---

If you'd like a story with a specific kind of weather, just let me know!


 stream.interruptions: []
 */
