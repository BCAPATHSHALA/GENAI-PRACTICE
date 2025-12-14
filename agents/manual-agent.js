import "dotenv/config";
import {
  StateGraph,
  START,
  END,
  MessagesAnnotation,
} from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import axios from "axios";

// Tool 1: Weather API - Get real-time weather by city
const weatherTool = tool(
  async ({ cityName }) => {
    console.log(`   🌤️  Fetching weather for: ${cityName}`);
    const url = `https://wttr.in/${cityName.toLowerCase()}?format=%C+%t`;
    try {
      const { data } = await axios.get(url, { responseType: "text" });
      return `The current weather in ${cityName} is ${data}`;
    } catch (error) {
      return `Error fetching weather: ${error.message}`;
    }
  },
  {
    name: "get_weather",
    description:
      "Get the current weather for a specific city. Use this when users ask about weather conditions.",
    schema: z.object({
      cityName: z
        .string()
        .describe(
          "The name of the city to get weather for (e.g., 'London', 'Tokyo')"
        ),
    }),
  }
);

// Tool 2: GitHub API - Get user profile information
const githubTool = tool(
  async ({ username }) => {
    console.log(`Fetching GitHub profile for: ${username}`);
    const url = `https://api.github.com/users/${username.toLowerCase()}`;
    try {
      const { data } = await axios.get(url);
      return JSON.stringify(
        {
          login: data.login,
          id: data.id,
          name: data.name,
          location: data.location,
          bio: data.bio,
          public_repos: data.public_repos,
          followers: data.followers,
          following: data.following,
          created_at: data.created_at,
        },
        null,
        2
      );
    } catch (error) {
      return `Error fetching GitHub user: ${error.message}`;
    }
  },
  {
    name: "get_github_user",
    description:
      "Get detailed information about a GitHub user by their username. Returns profile data including repos, followers, and bio.",
    schema: z.object({
      username: z
        .string()
        .describe(
          "The GitHub username to look up (e.g., 'torvalds', 'octocat')"
        ),
    }),
  }
);

const tools = [weatherTool, githubTool];

// STEP 1: Initialize AI Model with Tools
const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  apiKey: process.env.OPENAI_API_KEY,
}).bindTools(tools);

// STEP 2: Create Workflow Nodes
// Node 1: Call the LLM with tools
async function callModel(state) {
  console.log("\nStep 1: Calling LLM with tools...");

  const messages = state.messages;
  const response = await llm.invoke(messages);

  console.log(`LLM Response received`);
  if (response.tool_calls && response.tool_calls.length > 0) {
    console.log(`LLM wants to use ${response.tool_calls.length} tool(s)`);
    response.tool_calls.forEach((tc) => {
      console.log(`      - ${tc.name} with args:`, tc.args);
    });
  }

  return { messages: [response] };
}

// Node 2: Execute the tools requested by LLM
async function executeTool(state) {
  console.log("\nStep 2: Executing tools...");

  // Get the last message and its tool calls
  const lastMessage = state.messages[state.messages.length - 1];
  const toolCalls = lastMessage.tool_calls || [];

  if (toolCalls.length === 0) {
    console.log("   No tools to execute");
    return { messages: [] };
  }

  const toolMessages = [];

  for (const toolCall of toolCalls) {
    console.log(`\n   Executing: ${toolCall.name}`);

    // Find the matching tool
    const selectedTool = tools.find((t) => t.name === toolCall.name);

    if (!selectedTool) {
      console.error(`   Tool not found: ${toolCall.name}`);
      continue;
    }

    try {
      // Execute the tool with its arguments
      const toolResult = await selectedTool.invoke(toolCall.args);
      console.log(`   Tool result received`);

      // Create a tool message with the result
      toolMessages.push({
        role: "tool",
        content: toolResult,
        tool_call_id: toolCall.id,
        name: toolCall.name,
      });
    } catch (error) {
      console.error(`   Tool execution failed:`, error.message);
      toolMessages.push({
        role: "tool",
        content: `Error: ${error.message}`,
        tool_call_id: toolCall.id,
        name: toolCall.name,
      });
    }
  }

  return { messages: toolMessages };
}

// STEP 3: Define Routing (Conditional Logic) to decide which node to call next
function shouldContinue(state) {
  const lastMessage = state.messages[state.messages.length - 1];

  // If the last message has tool calls, execute them
  if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
    console.log("\nRouting: Tool execution needed → executeTool");
    return "executeTool";
  }

  // If the last message has no tool calls, no more tools needed → END
  console.log("\nRouting: No more tools needed → END");
  return END;
}

// STEP 4: Build the Workflow & Compile it
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("callModel", callModel)
  .addNode("executeTool", executeTool)
  .addEdge(START, "callModel")
  .addConditionalEdges("callModel", shouldContinue, {
    executeTool: "executeTool",
    [END]: END,
  })
  .addEdge("executeTool", "callModel"); // Loop back to model after tool execution

// Compile the workflow
const graph = workflow.compile();

// STEP 5: Run the Workflow
async function runWorkflow(userQuery) {
  console.log(`USER QUERY: "${userQuery}"`);
  console.log("─".repeat(50));

  const result = await graph.invoke({
    messages: [new HumanMessage(userQuery)],
  });

  // Get the final AI response (filter out tool messages)
  const finalMessages = result.messages.filter((msg) => {
    return msg.role === "assistant" && !msg.tool_calls;
  });

  console.log("\nFINAL ANSWER:");
  console.log("─".repeat(50));
  if (finalMessages.length > 0) {
    console.log(finalMessages[finalMessages.length - 1].content);
  } else {
    // If no final message, show the last message
    const lastMsg = result.messages[result.messages.length - 1];
    console.log(lastMsg.content || JSON.stringify(lastMsg, null, 2));
  }
  console.log("─".repeat(50));

  return result;
}

// STEP 6: Main Function to Run the Workflow
async function main() {
  try {
    // Example 1: Weather Tool
    console.log("\nEXAMPLE 1: Weather Tool");
    await runWorkflow(
      "What is the weather like in Tundla, Uttar Pradesh right now?"
    );

    // Example 2: GitHub Tool
    console.log("\n\nEXAMPLE 2: GitHub Tool");
    await runWorkflow("Can you show me the GitHub profile for BCAPATHSHALA?");

    // Example 3: Multiple Tools
    console.log("\n\nEXAMPLE 3: Multiple Tools in One Query");
    await runWorkflow(
      "Get the weather in Delhi and also show me the GitHub profile for websyro"
    );

    // Example 4: No Tools Needed
    console.log("\n\nEXAMPLE 4: Regular Conversation (No Tools)");
    await runWorkflow("What is artificial intelligence?");

    console.log("\n\nAll examples completed successfully!\n");
  } catch (error) {
    console.error("Error:", error.message);
    console.error(error.stack);
  }
}

main();
