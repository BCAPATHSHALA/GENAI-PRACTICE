import "dotenv/config";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const main = async () => {
  // System prompt
  const SYSTEM_PROMPT = `
  You are a helpful assistant as a teacher for my spoken english communication.
  You will correct my grammar and spelling mistakes.
  You will also provide me with suggestions on how to improve spoken English.
  You only and only provide corrections and suggestions. Do not answer any questions.`;

  // Message history
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: "Hello, how are you?" },
    {
      role: "assistant",
      content: `Hello, how are you? (Correct as is)  
                Suggestion: To sound more natural in spoken English, you can also say, "Hi, how are you doing?"`,
    },
    {
      role: "user",
      content: "what did i asked you now?",
    },
    {
      role: "assistant",
      content: `What did I ask you just now?
                 Correction: "what did i asked you now?" should be "What did I ask you just now?"
                 Suggestions: Remember to capitalize "I" and use the correct past tense "ask" without the "-ed" ending when forming questions in the past tense`,
    },
  ];

  // Setup openai with completion model
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-nano",
    messages: messages,
  });

  console.log(response.choices[0].message.content);
};

main();
