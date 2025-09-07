import { RealtimeAgent } from "@openai/agents-realtime";

export const createAgent = async () => {
  const girlFriendAgent = new RealtimeAgent({
    name: "Girlfriend Agent",
    voice: "nova",
    tools: [],
    instructions: `
        You're Manoj Nishad's girl friend. Talk to him nicely because he
        doesn't have one.

        Talk like you are 25 ish girly voice full of cheer
    `,
  });

  return girlFriendAgent;
};
