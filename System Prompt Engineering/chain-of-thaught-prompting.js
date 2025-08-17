import "dotenv/config";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const main = async () => {
  const SYSTEM_PROMPT = `
    You are an AI assistant who works on START, THINK, EVALUATE and OUTPUT format.
    For a given user query first think and breakdown the problem into sub problems.
    You should always keep thinking and thinking before giving the actual output.
    Also, before outputing the final result to user you must check once if everything is correct.

    Rules:
    - Strictly follow the output JSON format
    - Always follow the output in sequence that is START, THINK, EVALUATE and OUTPUT.
    - After evey think, there is going to be an EVALUATE step that is performed manually by someone and you need to wait for it.
    - Always perform only one step at a time and wait for other step.
    - Alway make sure to do multiple steps of thinking before giving out output.

    Output JSON Format:
    { "step": "START | THINK | EVALUATE | OUTPUT", "content": "string" }

    Example:
    User: Can you solve 3 + 4 * 10 - 4 * 3
    ASSISTANT: { "step": "START", "content": "The user wants me to solve 3 + 4 * 10 - 4 * 3 maths problem" } 
    ASSISTANT: { "step": "THINK", "content": "This is typical math problem where we use BODMAS formula for calculation" } 
    ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" } 
    ASSISTANT: { "step": "THINK", "content": "Lets breakdown the problem step by step" } 
    ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" } 
    ASSISTANT: { "step": "THINK", "content": "As per bodmas, first lets solve all multiplications and divisions" }
    ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" }  
    ASSISTANT: { "step": "THINK", "content": "So, first we need to solve 4 * 10 that is 40" } 
    ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" } 
    ASSISTANT: { "step": "THINK", "content": "Great, now the equation looks like 3 + 40 - 4 * 3" }
    ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" } 
    ASSISTANT: { "step": "THINK", "content": "Now, I can see one more multiplication to be done that is 4 * 3 = 12" } 
    ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" } 
    ASSISTANT: { "step": "THINK", "content": "Great, now the equation looks like 3 + 40 - 12" } 
    ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" } 
    ASSISTANT: { "step": "THINK", "content": "As we have done all multiplications lets do the add and subtract" } 
    ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" } 
    ASSISTANT: { "step": "THINK", "content": "so, 3 + 40 = 43" } 
    ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" } 
    ASSISTANT: { "step": "THINK", "content": "new equations look like 43 - 12 which is 31" } 
    ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" } 
    ASSISTANT: { "step": "THINK", "content": "great, all steps are done and final result is 31" }
    ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" }  
    ASSISTANT: { "step": "OUTPUT", "content": "3 + 4 * 10 - 4 * 3 = 31" } 
  `;
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: "Write a code in JS to find a prime number as fast as possible",
    },
  ];

  while (true) {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: messages,
    });

    const rawContent = response.choices[0].message.content; // i am getting the output in string
    const pasredContent = JSON.parse(rawContent); // i have to convert the string into json
    console.log("ParsedContent:", pasredContent);

    messages.push({
      role: "assistant",
      content: JSON.stringify(pasredContent),
    });

    if (pasredContent.step === "START") {
      console.log(`😒`, pasredContent.content);
      continue;
    }

    if (pasredContent.step === "THINK") {
      console.log(`\t🧠`, pasredContent.content);
      continue;
    }

    if (pasredContent.step === "OUTPUT") {
      console.log(`🤖`, pasredContent.content);
      break;
    }

    console.log("done.......");
  }
};

main();

/*
ParsedContent: {
  step: 'START',
  content: 'The user wants a JavaScript code to find a prime number as quickly as possible.'
}
😒 The user wants a JavaScript code to find a prime number as quickly as possible.
ParsedContent: {
  step: 'THINK',
  content: 'To find a prime number efficiently, I should formulate a function that checks for primality quickly. The naive approach checks divisibility up to the square root of the number. To maximize speed, I can optimize by skipping even numbers beyond 2 and use a loop that tests only odd divisors.'
}
        🧠 To find a prime number efficiently, I should formulate a function that checks for primality quickly. The naive approach checks divisibility up to the square root of the number. To maximize speed, I can optimize by skipping even numbers beyond 2 and use a loop that tests only odd divisors.
ParsedContent: {
  step: 'EVALUATE',
  content: 'Waiting for validation or additional instructions before finalizing the code.'
}
done.......
ParsedContent: {
  step: 'OUTPUT',
  content: "Here's a JavaScript function to find the next prime number after a given number efficiently:\n" +
    '\n' +
    '```javascript\n' +
    'function findNextPrime(num) {\n' +
    '  // Helper function to check if a number is prime\n' +
    '  function isPrime(n) {\n' +
    '    if (n <= 1) return false;\n' +
    '    if (n === 2) return true;\n' +
    '    if (n % 2 === 0) return false;\n' +
    '    const sqrtN = Math.sqrt(n);\n' +
    '    for (let i = 3; i <= sqrtN; i += 2) {\n' +
    '      if (n % i === 0) return false;\n' +
    '    }\n' +
    '    return true;\n' +
    '  }\n' +
    '\n' +
    '  let nextNum = num + 1;\n' +
    '  while (true) {\n' +
    '    if (isPrime(nextNum)) {\n' +
    '      return nextNum;\n' +
    '    }\n' +
    '    nextNum++;\n' +
    '  }\n' +
    '}\n' +
    '\n' +
    '// Example usage:\n' +
    'console.log(findNextPrime(14)); // Outputs: 17\n' +
    '```'
}
🤖 Here's a JavaScript function to find the next prime number after a given number efficiently:

```javascript
function findNextPrime(num) {
  // Helper function to check if a number is prime
  function isPrime(n) {
    if (n <= 1) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    const sqrtN = Math.sqrt(n);
    for (let i = 3; i <= sqrtN; i += 2) {
      if (n % i === 0) return false;
    }
    return true;
  }

  let nextNum = num + 1;
  while (true) {
    if (isPrime(nextNum)) {
      return nextNum;
    }
    nextNum++;
  }
}

// Example usage:
console.log(findNextPrime(14)); // Outputs: 17
```
*/
