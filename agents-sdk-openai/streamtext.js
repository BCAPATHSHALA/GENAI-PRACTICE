import "dotenv/config";
import { Agent, run } from "@openai/agents";

const agent = new Agent({
  name: "Storyteller",
  instructions:
    "You are a storyteller. You will be given a topic and you will tell a story about it.",
});

const result = await run(agent, "Tell me a story about a cat.", {
  stream: true,
});

result
  .toTextStream({
    compatibleWithNodeStreams: true,
  })
  .pipe(process.stdout);

/*
  PS E:\DEV ECOSYSTEM\GENAI PROJECTS\genai practice\agents-sdk-openai> node streamtext.js
Of course! Here’s a story about a clever little cat:

---

In a quiet village perched between rolling hills and murmuring brooks, there lived a cat named Nimbus. Nimbus wasn’t like the other cats. While her neighbors prowled in the moonlight for mice, Nimbus had her eyes set on higher pursuits—specifically, a strange, enchanting light that appeared each night atop the old clock tower at the center of the village.

Nimbus first noticed the light one blustery autumn evening. It twinkled through the mist, neither candle nor lantern, and pulsed with a color she couldn’t quite name. Curious, Nimbus crept from her cozy windowsill, leapt between rain-beaded roofs, and landed softly in the shadow of the clock tower.

She climbed, nimble and brave, her paws finding purchase on weathered stones and iron drainpipes. The wind howled, trying to discourage her, but Nimbus pressed on. At last, she reached the highest window, tucked beneath the chimes and gears.

Inside, an ancient clockmaker dozed in a battered chair, a book open on his knees. But Nimbus barely spared him a glance—her gaze was captured by the light. It hovered in the air, warm and dancing, as if inviting her to play.

Nimbus gave a curious chirp. The light spun, dipping closer, and in a soft shimmer, it unfolded into a tiny, radiant moth. Nimbus watched, wide-eyed, as the moth flickered and wrote shapes in the air—fairy-tale symbols and maps, secrets only cats could truly understand.

Each night after, Nimbus returned. The moth greeted her with new patterns, teaching her the stories of winds and stars, how rain moves over rivers, and where the fattest mice sleep when the world turns cold. Nimbus listened and learned, growing wise with quiet magic.

She never chased the moth, not once. For some stories aren’t meant to be caught—only cherished, and shared. So Nimbus kept the moth’s secrets and, if you ever wander down to the village at dusk, you might just see a clever little cat watching the clock tower, eyes twinkling with stories waiting for the telling.

---

Would you like another story about Nimbus or a different kind of cat tale?
    */
