import "dotenv/config";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const main = async () => {
  try {
    // Step 6: user input query
    const userQuery =
      "please, can you tell me about the hosting concept in node.js";
    const SYSTEM_PROMPT = `You are an AI assistant that answers questions based on the provided context available to you from a PDF file with the content and page number. Only answer based on the available context from file.
    
    Context: ..............`;
    const messagesHistory = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userQuery },
    ];
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: messagesHistory,
    });
    console.log("Response:", response.choices[0].message.content);
  } catch (error) {
    console.log(`Reterival chat phase error: ${err}`);
  }
};

main();
