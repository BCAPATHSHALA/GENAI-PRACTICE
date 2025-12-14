import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import {
  StateGraph,
  START,
  END,
  MessagesAnnotation,
} from "@langchain/langgraph";
import axios from "axios";

// Weather API tool
async function getWeatherDetailsByCity(cityname = "") {
  const url = `https://wttr.in/${cityname.toLowerCase()}?format=%C+%t`;
  const { data } = await axios.get(url, { responseType: "text" });
  return `The current weather of ${cityname} is ${data}`;
}

// Step 1: Initialize the OpenAI LLM
const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  apiKey: process.env.OPENAI_API_KEY,
});

// Step 2: Create the LangGraph workflow node functions

// Node 1: Create a workflow node for calling openai llm
const callOpenAINode = async (state) => {
  const response = await llm.invoke(state.messages);

  console.log("AI Response from LLM:", response);

  // Return the new messages to be added to the state
  return {
    messages: [...state.messages, response],
  };
};

// Node 2: Create a workflow node for calling weather api
const callWeatherAPINode = async (state) => {
  const response = await getWeatherDetailsByCity(state.city);

  console.log("AI Response from Weather API:", response);

  // Return the new messages to be added to the state
  return {
    messages: [...state.messages, response],
  };
};

// Step 3: Create the LangGraph workflow
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("callOpenAI", callOpenAINode)
  .addNode("callWeatherAPI", callWeatherAPINode)
  .addEdge(START, "callOpenAI")
  .addConditionalEdges("callOpenAI", (state) => {
    // Analyze the last user message to decide the next step
    const lastMsg = state.messages.at(-1)?.content.toLowerCase();
    if (lastMsg.includes("weather")) {
      return "callWeatherAPI";
    } else {
      return END;
    }
  })
  .addEdge("callOpenAI", END);

// Compile the workflow
const graph = workflow.compile();

// Step 4: Execute the workflow with initial messages
async function main() {
  // State: shared state across the workflow 
  const initialState = {
    messages: [{ role: "user", content: "What is the weather in Delhi?" }],
  };

  const result = await graph.invoke(initialState);

  console.log("Final AI Response:", result.messages);
}

main();
