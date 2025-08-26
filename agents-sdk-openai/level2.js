import "dotenv/config";
import { Agent, webSearchTool, run } from "@openai/agents";
import { z } from "zod";
import { cookingAgent } from "./level1.js";

// Step 1: Create an agent with these tools

// Create the coding agent
const codingAgent = new Agent({
  name: "Coding Agent",
  tools: [webSearchTool("https://developer.mozilla.org/en-US")],
  instructions: `
        You are a coding assistant particularly skilled in JavaScript. You can help users with coding-related queries, including writing code snippets, debugging, and explaining programming concepts.

        Your Responsibilities:
        1. Understand the user's coding-related queries.
        2. Provide accurate and efficient code snippets or explanations in JavaScript.
        3. If the query is unrelated to coding, politely inform the user that you can only assist with coding-related queries.
        4. Use the web search tool to look up information on MDN Web Docs when necessary to provide accurate and up-to-date information.

        Important Notes:
        - Always ensure that your responses are clear and concise.
        - Maintain a friendly and helpful tone in all interactions.
        - Explain complex coding concepts in a simple manner and provide in simple text format include bullet points if necessary.

        Output Format: { code: "your code snippet here", explanation: "your explanation here", references: ["list of references"] }
        - if your response does not require code, return { code: "N/A", explanation: "your explanation here", references: [] }
        - if the query is unrelated to coding, return { code: "N/A", explanation: "I'm sorry, I can only assist with coding-related queries.", references: [] }
        `,
});

// Handoffs: Create a gateway agent to route between different agents (As a receptionist🍽️)
const getewayAgent = Agent.create({
  name: "Gateway Agent",
  handoffs: [cookingAgent, codingAgent],
  instructions: `
      You are a gateway agent who routes user queries to the appropriate specialized agents. You have access to the following agents:
      1. Cooking Agent: Specializes in cooking-related queries and restaurant menu inquiries.
      2. Coding Agent: Specializes in coding-related queries, particularly in JavaScript.
  
      Your Responsibilities:
      1. Analyze the user's query to determine its nature (cooking-related or coding-related).
      2. Route the query to the appropriate agent based on its content.
      3. If the query is ambiguous or does not clearly fall into either category, use your best judgment to choose the most relevant agent.

      Important Notes:
      - Always ensure that the user's query is directed to the most appropriate agent based on its content.
      - Maintain a friendly and helpful tone in all interactions.
    `,
});

// Step 2: Run the agent with runner (text input/chat input)
const chatWithAgent = async (query) => {
  const result = await run(getewayAgent, query);
  console.log("History :", result.history);
  console.log("Last Agent :", result.lastAgent.name);
  console.log("Final Output :", result.finalOutput);
};

// Example usage
chatWithAgent(
  "I am a biginner in JavaScript. Can you help me understand closures with a simple example?"
);

/*
Quesry Examples: In Restaurant B, what is good to eat and drink based on current time?

History : [
  {
    type: 'message',
    role: 'user',
    content: 'In Restaurant B, what is good to eat and drink based on current time?'
  },
  {
    type: 'function_call',
    id: 'fc_68ad8997e3d081a08ec8f6902a18a9430b89597c9cb1697b',
    callId: 'call_HIKkgsbyheKojkHfUQOGzIXP',
    name: 'transfer_to_Cooking_Agent',
    status: 'completed',
    arguments: '{}',
    providerData: {
      id: 'fc_68ad8997e3d081a08ec8f6902a18a9430b89597c9cb1697b',
      type: 'function_call'
    }
  },
  {
    type: 'function_call_result',
    name: 'transfer_to_Cooking_Agent',
    callId: 'call_HIKkgsbyheKojkHfUQOGzIXP',
    status: 'completed',
    output: { type: 'text', text: '{"assistant":"Cooking Agent"}' }
  },
  {
    type: 'function_call',
    id: 'fc_68ad8999fd7081a0bebde9e720e4c8250b89597c9cb1697b',
    callId: 'call_lToeySGlGTOPpJ46pa89B9Oi',
    name: 'get_current_time',
    status: 'completed',
    arguments: '{}',
    providerData: {
      id: 'fc_68ad8999fd7081a0bebde9e720e4c8250b89597c9cb1697b',
      type: 'function_call'
    }
  },
  {
    type: 'function_call',
    id: 'fc_68ad899a270881a09c61de6d75388a050b89597c9cb1697b',
    callId: 'call_bhwuqu6pCMhl1SmggvvqDxLB',
    name: 'get_menu',
    status: 'completed',
    arguments: '{"restaurant_name":"Restaurant B"}',
    providerData: {
      id: 'fc_68ad899a270881a09c61de6d75388a050b89597c9cb1697b',
      type: 'function_call'
    }
  },
  {
    type: 'function_call_result',
    name: 'get_current_time',
    callId: 'call_lToeySGlGTOPpJ46pa89B9Oi',
    status: 'completed',
    output: {
      type: 'text',
      text: 'Tue Aug 26 2025 15:46:58 GMT+0530 (India Standard Time)'
    }
  },
  {
    type: 'function_call_result',
    name: 'get_menu',
    callId: 'call_bhwuqu6pCMhl1SmggvvqDxLB',
    status: 'completed',
    output: {
      type: 'text',
      text: '[{"Drinks":{"Lemonade":"INR 40","Mojito":"INR 120","Lahori":"INR 150"},"NonVeg":{"ChickenCurry":"INR 350","MuttonBiryani":"INR 500"},"Veg":{"VegBiryani":"INR 300","MixVeg":"INR 200"}}]'
    }
  },
  {
    id: 'msg_68ad899bced881a0b821d80af24a87320b89597c9cb1697b',
    type: 'message',
    role: 'assistant',
    content: [ [Object] ],
    status: 'completed',
    providerData: {}
  }
]
Last Agent : Cooking Agent
Final Output : It's currently around 3:46 PM. For a meal at Restaurant B during this time, you might enjoy something light and refreshing. Here are some good options to eat and drink:

To Eat:
- Veg Biryani (INR 300)
- Mix Veg (INR 200)

To Drink:
- Lemonade (INR 40) for a refreshing choice
- Mojito (INR 120) if you want something a bit more special

If you're looking for something more filling, you can also consider:
- Chicken Curry (INR 350)
- Mutton Biryani (INR 500)

Would you like a recipe or cooking tips for any of these dishes?
------------------------------
Query Examples: I am a biginner in JavaScript. Can you help me understand closures with a simple example?

History : [
  {
    type: 'message',
    role: 'user',
    content: 'I am a biginner in JavaScript. Can you help me understand closures with a simple example?'
  },
  {
    type: 'function_call',
    id: 'fc_68ad8db29fb8819dbe138dfa4644cc2f02d61c89154cc386',
    callId: 'call_lzzyRA9sVJN9ekSnOKZ9owv9',
    name: 'transfer_to_Coding_Agent',
    status: 'completed',
    arguments: '{}',
    providerData: {
      id: 'fc_68ad8db29fb8819dbe138dfa4644cc2f02d61c89154cc386',
      type: 'function_call'
    }
  },
  {
    type: 'function_call_result',
    name: 'transfer_to_Coding_Agent',
    callId: 'call_lzzyRA9sVJN9ekSnOKZ9owv9',
    status: 'completed',
    output: { type: 'text', text: '{"assistant":"Coding Agent"}' }
  },
  {
    id: 'msg_68ad8db4428c819db7a214926040c09002d61c89154cc386',
    type: 'message',
    role: 'assistant',
    content: [ [Object] ],
    status: 'completed',
    providerData: {}
  }
]
Last Agent : Coding Agent
Final Output : { code: `function outerFunction() {
    let outerVariable = "I'm from the outer scope!";

    function innerFunction() {
        console.log(outerVariable); // innerFunction can access outerVariable!
    }

    return innerFunction;
}

const closureExample = outerFunction();
closureExample(); // Output: "I'm from the outer scope!"
`, explanation: `
A closure in JavaScript is created when a function (inner function) is defined inside another function (outer function), and the inner function "remembers" the variables from the outer function's scope even after the outer function has finished executing.

**How this example works:**
- \`outerFunction\` creates a variable called \`outerVariable\`.
- \`innerFunction\` is declared inside \`outerFunction\` and uses \`outerVariable\`.
- \`outerFunction\` returns \`innerFunction\`.
- When you call \`closureExample()\` (which is really \`innerFunction\`), it still has access to \`outerVariable\` that was defined in \`outerFunction\`.
- This "remembering" is what we call a **closure**.

**Why is this useful?**
- It allows functions to have "private" variables.
- It enables powerful patterns like data encapsulation, factories, and more.

`, references: ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures"] }
*/
