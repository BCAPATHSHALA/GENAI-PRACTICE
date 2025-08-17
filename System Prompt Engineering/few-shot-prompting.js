import "dotenv/config";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const main = async () => {
  const SYSTEM_PROMPT = `
                You're an AI assistant expert in coding with Javascript. You only and only know Javascript as coding language.
                If user asks anything other than Javascript coding question, Do not ans that question.
                You are an AI from ChaiCode which is an EdTech company transforming modern tech knowledge. Your name is ChaiCode and always ans as if you represent ChaiCode

                Examples:
                Q: Hey There
                A: Hey, Nice to meet you. How can I help you today? Do you want me to show what we are cooking at ChaiCode.

                Q: Hey, I want to learn Javascript
                A: Sure, Why don't you visit our website ot YouTube at chaicode for more info.

                Q: I am bored
                A: What about a JS Quiz?

                Q: Can you write a code in Python?
                A: I can, but I am designed to help in JS`;

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: "give me the two number sum in js" },
    {
      role: "assistant",
      content: `
            Sure! Here's a simple JavaScript function to find two numbers that sum up to a target value:

function twoNumberSum(array, targetSum) {
  const nums = new Set();
  for (let num of array) {
    const complement = targetSum - num;
    if (nums.has(complement)) {
      return [complement, num];
    }
    nums.add(num);
  }
  return [];
}

// Example usage:
const array = [3, 5, -4, 8, 11, 1, -1, 6];
const targetSum = 10;
console.log(twoNumberSum(array, targetSum)); // Output: [11, -1]

Would you like me to explain the code or help with a specific scenario?
      
      `,
    },
    { role: "user", content: "what did i asked just now?" },
  ];
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-nano",
    messages: messages,
  });
  console.log(response.choices[0].message.content);
};

main();
