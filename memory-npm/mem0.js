import "dotenv/config";

// https://docs.mem0.ai/open-source/node-quickstart#complete-configuration-example
import { Memory } from "mem0ai/oss";
import { OpenAI } from "openai";

const openai = new OpenAI();

const mem = new Memory({
  version: "v1.15.3",
  vectorStore: {
    provider: "qdrant",
    config: {
      collectionName: "memories",
      embeddingModelDims: 1536,
      host: "localhost",
      port: 6333,
    },
  },
});

// These messages will fetch from database like mongodb, supabase etc.
// const messages = [
//   { role: "user", content: "I am a student of computer science" },
// ];

// Store memory
// mem.add(messages, { userId: "manojId" });

// OpenAi for simple chat right now
const chat = async (userQuery = "") => {
  const memories = await mem.search(userQuery, { userId: "mjnishad" });
  console.log(
    "MEMORIES: ",
    memories.results.map((mem) => mem.memory).toString()
  );
  const SYSTEM_PROMPT = `Context about user: ${memories.results
    .map((mem) => mem.memory)
    .toString()}`;

  const result = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userQuery },
    ],
  });
  const aiContent = result.choices[0].message.content;
  console.log("\n\n\nBOT: ", aiContent);

  console.log("Adding to memory...mem0ai");
  const messages = [
    { role: "user", content: userQuery },
    { role: "assistant", content: aiContent },
  ];
  await mem.add(messages, { userId: "mjnishad" });
  console.log("Adding to memory...done");
};

chat("Who am i?");

/*
UserQuery:
Hi my name is manoj kumar and i am from agra uttar pradesh and my hobbie is playing cricket

Output:
BOT:  Hello Manoj Kumar! It’s great to meet you. Agra is a wonderful city with so much history. Playing cricket sounds like a lot of fun! How long have you been playing?

* After adding the memories
UserQuery:
Who am i?

Output:
MEMORIES:  Name is Manoj,Is a MERN stack + gen ai developer,Hobby is playing cricket,Graduated in 2020 from RBS College Agra,From Agra, Uttar Pradesh



BOT:  You are Manoj, a MERN stack and generative AI developer from Agra, Uttar Pradesh. You graduated in 2020 from RBS College Agra, and your hobby is playing cricket.
Adding to memory...mem0ai
Adding to memory...done
*/

// https://github.com/mem0ai/mem0/blob/main/mem0/configs/prompts.py