import "dotenv/config";

import { Memory } from "mem0ai/oss";
import { OpenAI } from "openai";

const openai = new OpenAI();

const mem = new Memory({
  version: "v1.15.3",
  enableGraph: true,
  graphStore: {
    provider: "neo4j",
    config: {
      url: "neo4j://localhost:7687",
      username: "neo4j",
      password: "reform-william-center-vibrate-press-5829",
    },
  },
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
    model: "gpt-4.1-nano",
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

chat(
  "Hey my name is manoj kumar and i am sutudent of computer science and i am from uttar pradesh india"
);

/*
Client version 1.13.0 is incompatible with server version 1.15.3. Major versions should match and minor version difference must not exceed 1. Set checkCompatibility=false to skip version check.
Error getting user ID: ApiError: Conflict
    at Object.fun [as createCollection] (file:///E:/DEV%20ECOSYSTEM/GENAI%20PROJECTS/genai%20practice/memory-npm/node_modules/@qdrant/openapi-typescript-fetch/dist/esm/fetcher.js:169:23)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async QdrantClient.createCollection (file:///E:/DEV%20ECOSYSTEM/GENAI%20PROJECTS/genai%20practice/memory-npm/node_modules/@qdrant/js-client-rest/dist/esm/qdrant-client.js:929:26)
    at async Qdrant.getUserId (file:///E:/DEV%20ECOSYSTEM/GENAI%20PROJECTS/genai%20practice/memory-npm/node_modules/mem0ai/dist/oss/index.mjs:729:9)
    at async _Memory._getTelemetryId (file:///E:/DEV%20ECOSYSTEM/GENAI%20PROJECTS/genai%20practice/memory-npm/node_modules/mem0ai/dist/oss/index.mjs:4089:28)
    at async _Memory._initializeTelemetry (file:///E:/DEV%20ECOSYSTEM/GENAI%20PROJECTS/genai%20practice/memory-npm/node_modules/mem0ai/dist/oss/index.mjs:4076:7) {
  headers: Headers {
    'transfer-encoding': 'chunked',
    'content-encoding': 'gzip',
    vary: 'accept-encoding, Origin, Access-Control-Request-Method, Access-Control-Request-Headers',
    'content-type': 'application/json',
    date: 'Sat, 06 Sep 2025 11:48:29 GMT'
  },
  url: 'http://localhost:6333/collections/memory_migrations',
  status: 409,
  statusText: 'Conflict',
  data: {
    status: {
      error: 'Wrong input: Collection `memory_migrations` already exists!'
    },
    time: 0.454365201
  }
}
[DEBUG] Entity type map: {"manoj_kumar":"person","computer_science":"field_of_study","uttar_pradesh":"location","india":"location"}
MEMORIES:



BOT:  Hello Manoj Kumar! It's great to meet you. As a computer science student from Uttar Pradesh, you're in a wonderful field with lots of exciting opportunities. If you have any questions or need help with your studies, feel free to ask. How can I assist you today?
Adding to memory...mem0ai
[DEBUG] Entity type map: {"manoj_kumar":"person","computer_science":"organization","uttar_pradesh":"location","india":"location"}
[DEBUG] Extracted entities: [{"source":"manoj_kumar","relationship":"name_of","destination":"mjnishad"},{"source":"manoj_kumar","relationship":"field_of_study","destination":"computer_science"},{"source":"manoj_kumar","relationship":"resident_of","destination":"uttar_pradesh"},{"source":"uttar_pradesh","relationship":"located_in","destination":"india"}]
[DEBUG] Deleted relationships: []
Adding to memory...done
*/
