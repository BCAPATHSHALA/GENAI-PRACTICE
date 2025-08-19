import "dotenv/config";
import { OpenAI } from "openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const main = async () => {
  try {
    const userQuery =
      "please, can you tell me about the MongoDB hosting is what and why use?";

    // Step 7: create vector embedding for for user query
    const embeddings = new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY,
      model: "text-embedding-3-large",
    });

    // Step 8: search relevant vector embedding from vector Database Qdrant DB
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: "http://localhost:6333",
        collectionName: "notebookllm",
      }
    );

    // Step 9: retrieve relevant chunks from top 3 most relevant chunks for any query
    const vectorRetriver = vectorStore.asRetriever({
      k: 3,
    });
    const relevantChunks = await vectorRetriver.invoke(userQuery);

    // Step 6: user input query
    const SYSTEM_PROMPT = `You are an AI assistant that answers questions based on the provided context available to you from a PDF file with the content and page number. Only answer based on the available context from file.
    
    Context: ${JSON.stringify(relevantChunks)}`;

    // Step 10: pass relevant data & user input query to chat LLM(s) to get the relevant answere
    const messagesHistory = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userQuery },
    ];
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: messagesHistory,
    });

    // Step 11: user get the final output through chat LLM
    console.log("Response:", response.choices[0].message.content);
  } catch (error) {
    console.log(`Reterival chat phase error: ${err}`);
  }
};

main();

/*
const userQuery =
      "please, can you tell me about the hosting concept in node.js";
Response: The provided document does not contain information specifically about the hosting concept in Node.js.

-----------------------------

const userQuery =
      "please, can you tell me about the MongoDB hosting is what and why use?";
Response: Based on the provided content, MongoDB hosting refers to deploying and managing your MongoDB database on a dedicated platform or service. One example mentioned is MongoDB Atlas, which is the official managed hosting platform for MongoDB released by the MongoDB organization. It allows you to set up a production-ready MongoDB database without the need to manage the underlying infrastructure yourself.

Why use MongoDB hosting?
- It simplifies the deployment process and reduces administrative overhead.
- Ensures reliable and secure data storage.
- Provides scalable options to handle increasing data and traffic.
- Offers features like automatic backups, updates, and monitoring.
- Facilitates easier deployment and management of your database in production environments.

Using a managed hosting platform like MongoDB Atlas is especially beneficial for scaling applications, ensuring uptime, and focusing on development rather than infrastructure management.
*/
