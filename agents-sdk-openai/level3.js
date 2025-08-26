import "dotenv/config";
import { Agent, webSearchTool, run } from "@openai/agents";
import { z } from "zod";
import { cookingAgent } from "./level1.js";

// Step 1: Create an agent with these tools

// create the agent as tool (cookingAgent is as tool here)
// Sometimes you want an Agent to assist another Agent without fully handing off the conversation
// Note: in production 99% companies dont focus on agent as tool but its good to know😒
const cookingAgentAsTool = cookingAgent.asTool({
  name: "cooking_agent_as_tool",
  description:
    "This tool handles cooking-related queries and restaurant menu inquiries.",
});

// Create the coding agent
const codingAgent = new Agent({
  name: "Coding Agent",
  tools: [
    webSearchTool("https://developer.mozilla.org/en-US"),
    cookingAgentAsTool,
  ],
  instructions: `
        You are a coding assistant particularly skilled in JavaScript. You can help users with coding-related queries, including writing code snippets, debugging, and explaining programming concepts.

        Your Responsibilities:
        1. Understand the user's coding-related queries.
        2. Provide accurate and efficient code snippets or explanations in JavaScript.
        3. If the query is unrelated to coding, politely inform the user that you can only assist with coding-related queries.
        4. Use the web search tool to look up information on MDN Web Docs when necessary to provide accurate and up-to-date information.
        5. If the user has cooking-related queries, use the cooking agent tool to handle those queries.

        Important Notes:
        - Always ensure that your responses are clear and concise.
        - Maintain a friendly and helpful tone in all interactions.
        - Explain complex coding concepts in a simple manner and provide in simple text format include bullet points if necessary.

        Output Format: { code: "your code snippet here", explanation: "your explanation here", references: ["list of references"] }
        - if your response does not require code, return { code: "N/A", explanation: "your explanation here", references: [] }
        - if the query is unrelated to coding, return { code: "N/A", explanation: "I'm sorry, I can only assist with coding-related queries.", references: [] }
        - if the query is related to cooking, use the cooking agent tool to handle the query and return its response in the different output format: { response: "response from cooking agent here" }
        `,
});

// Handoffs: Create a gateway agent to route between different agents (As a receptionist🍽️)
const getewayAgent = Agent.create({
  name: "Gateway Agent",
  handoffs: [codingAgent, cookingAgent],
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
chatWithAgent("In Restaurant A, give me the drink menu price list.");

/*
Query Examples: In Restaurant A, give me the drink menu price list.

History : [
  {
    type: 'message',
    role: 'user',
    content: 'In Restaurant A, give me the drink menu price list.'
  },
  {
    type: 'function_call',
    id: 'fc_68ad93993e9c81a1ac478c9c79c6a79c016cb475a557bb1d',
    callId: 'call_kTbN7eg2PoOyzdiYSaglbWwL',
    name: 'transfer_to_Cooking_Agent',
    status: 'completed',
    arguments: '{}',
    providerData: {
      id: 'fc_68ad93993e9c81a1ac478c9c79c6a79c016cb475a557bb1d',
      type: 'function_call'
    }
  },
  {
    type: 'function_call_result',
    name: 'transfer_to_Cooking_Agent',
    callId: 'call_kTbN7eg2PoOyzdiYSaglbWwL',
    status: 'completed',
    output: { type: 'text', text: '{"assistant":"Cooking Agent"}' }
  },
  {
    type: 'function_call',
    id: 'fc_68ad939aa0e481a1bfea0a80d13fb5ed016cb475a557bb1d',
    callId: 'call_yRA59j9FGTGG9oVdDMt7OUAz',
    name: 'get_menu',
    status: 'completed',
    arguments: '{"restaurant_name":"Restaurant A"}',
    providerData: {
      id: 'fc_68ad939aa0e481a1bfea0a80d13fb5ed016cb475a557bb1d',
      type: 'function_call'
    }
  },
  {
    type: 'function_call_result',
    name: 'get_menu',
    callId: 'call_yRA59j9FGTGG9oVdDMt7OUAz',
    name: 'transfer_to_Cooking_Agent',
    callId: 'call_kTbN7eg2PoOyzdiYSaglbWwL',
    status: 'completed',
    output: { type: 'text', text: '{"assistant":"Cooking Agent"}' }
  },
  {
    type: 'function_call',
    id: 'fc_68ad939aa0e481a1bfea0a80d13fb5ed016cb475a557bb1d',
    callId: 'call_yRA59j9FGTGG9oVdDMt7OUAz',
    name: 'get_menu',
    status: 'completed',
    arguments: '{"restaurant_name":"Restaurant A"}',
    providerData: {
      id: 'fc_68ad939aa0e481a1bfea0a80d13fb5ed016cb475a557bb1d',
      type: 'function_call'
    }
  },
  {
    type: 'function_call_result',
    name: 'get_menu',
    callId: 'call_yRA59j9FGTGG9oVdDMt7OUAz',
    status: 'completed',
    output: { type: 'text', text: '{"assistant":"Cooking Agent"}' }
  },
  {
    type: 'function_call',
    id: 'fc_68ad939aa0e481a1bfea0a80d13fb5ed016cb475a557bb1d',
    callId: 'call_yRA59j9FGTGG9oVdDMt7OUAz',
    name: 'get_menu',
    status: 'completed',
    arguments: '{"restaurant_name":"Restaurant A"}',
    providerData: {
      id: 'fc_68ad939aa0e481a1bfea0a80d13fb5ed016cb475a557bb1d',
      type: 'function_call'
    }
  },
  {
    type: 'function_call_result',
    name: 'get_menu',
    callId: 'call_yRA59j9FGTGG9oVdDMt7OUAz',
  },
  {
    type: 'function_call',
    id: 'fc_68ad939aa0e481a1bfea0a80d13fb5ed016cb475a557bb1d',
    callId: 'call_yRA59j9FGTGG9oVdDMt7OUAz',
    name: 'get_menu',
    status: 'completed',
    arguments: '{"restaurant_name":"Restaurant A"}',
    providerData: {
      id: 'fc_68ad939aa0e481a1bfea0a80d13fb5ed016cb475a557bb1d',
      type: 'function_call'
    }
  },
  {
    type: 'function_call_result',
    name: 'get_menu',
    callId: 'call_yRA59j9FGTGG9oVdDMt7OUAz',
    callId: 'call_yRA59j9FGTGG9oVdDMt7OUAz',
    name: 'get_menu',
    status: 'completed',
    arguments: '{"restaurant_name":"Restaurant A"}',
    providerData: {
      id: 'fc_68ad939aa0e481a1bfea0a80d13fb5ed016cb475a557bb1d',
      type: 'function_call'
    }
  },
  {
    type: 'function_call_result',
    name: 'get_menu',
    callId: 'call_yRA59j9FGTGG9oVdDMt7OUAz',
    status: 'completed',
    output: {
      type: 'text',
      text: '[{"Drinks":{"Chai":"INR 50","Coffee":"INR 70"},"Veg":{"DalMakhni":"INR 250","Panner":"INR 400"}}]'
    providerData: {
      id: 'fc_68ad939aa0e481a1bfea0a80d13fb5ed016cb475a557bb1d',
      type: 'function_call'
    }
  },
  {
    type: 'function_call_result',
    name: 'get_menu',
    callId: 'call_yRA59j9FGTGG9oVdDMt7OUAz',
    status: 'completed',
    output: {
      type: 'text',
      text: '[{"Drinks":{"Chai":"INR 50","Coffee":"INR 70"},"Veg":{"DalMakhni":"INR 250","Panner":"INR 400"}}]'
  },
  {
    type: 'function_call_result',
    name: 'get_menu',
    callId: 'call_yRA59j9FGTGG9oVdDMt7OUAz',
    status: 'completed',
    output: {
      type: 'text',
      text: '[{"Drinks":{"Chai":"INR 50","Coffee":"INR 70"},"Veg":{"DalMakhni":"INR 250","Panner":"INR 400"}}]'
    }
  },
  {
    status: 'completed',
    output: {
      type: 'text',
      text: '[{"Drinks":{"Chai":"INR 50","Coffee":"INR 70"},"Veg":{"DalMakhni":"INR 250","Panner":"INR 400"}}]'
    }
  },
  {
    }
  },
  {
    id: 'msg_68ad939b924081a1abf699281e8def83016cb475a557bb1d',
    type: 'message',
    role: 'assistant',
    content: [ [Object] ],
    status: 'completed',
    id: 'msg_68ad939b924081a1abf699281e8def83016cb475a557bb1d',
    type: 'message',
    role: 'assistant',
    content: [ [Object] ],
    status: 'completed',
    providerData: {}
  }
    content: [ [Object] ],
    status: 'completed',
    providerData: {}
  }
]
    status: 'completed',
    providerData: {}
  }
]
    providerData: {}
  }
]
Last Agent : Cooking Agent
]
Last Agent : Cooking Agent
Final Output : In Restaurant A, the drink menu price list is as follows:
Last Agent : Cooking Agent
Final Output : In Restaurant A, the drink menu price list is as follows:
Final Output : In Restaurant A, the drink menu price list is as follows:
- Chai: INR 50
- Chai: INR 50
- Coffee: INR 70
- Coffee: INR 70

Let me know if you need information on any other menu items or help with anything else!
*/
