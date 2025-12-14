// SIMPLE WORKFLOW: Basic AI Conversation
import "dotenv/config";
import {
  StateGraph,
  MessagesAnnotation,
  START,
  END,
} from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

// Step 1: Initialize the AI model
const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  apiKey: process.env.OPENAI_API_KEY,
});

// Step 2: Create the OpenAI Call Node
async function callOpenAI(state) {
  console.log(
    "Calling OpenAI with:",
    state.messages[state.messages.length - 1].content
  );

  const response = await llm.invoke(state.messages);
  console.log("AI Response:", response.content);

  // Return the new messages to be added to state
  return {
    messages: [response],
  };
}

// Step 3: Build the workflow & compile it
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("callOpenAI", callOpenAI)
  .addEdge(START, "callOpenAI")
  .addEdge("callOpenAI", END);

// Compile the workflow
const graph = workflow.compile();

// Step 4: Run the workflow
async function runWorkflow() {
  const userQuery = "What is the capital of Uttar Pradesh?";
  const initialState = {
    messages: [new HumanMessage(userQuery)],
  };

  const result = await graph.invoke(initialState);

  console.log(
    "Final Result:",
    result.messages[result.messages.length - 1].content
  );
}

runWorkflow();
