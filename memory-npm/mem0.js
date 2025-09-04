import "dotenv/config";

// https://docs.mem0.ai/open-source/node-quickstart#complete-configuration-example
import { Memory } from "mem0ai/oss";

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
const messages = [
  { role: "user", content: "I am a student of computer science" },
];

// Store memory
mem.add(messages, { userId: "manojId" });
