// Advanced Workflow: Multi-Step Agent with Conditional Logic
import "dotenv/config";
import {
  StateGraph,
  MessagesAnnotation,
  START,
  END,
} from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

// Step 1: Initialize the AI model
const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  apiKey: process.env.OPENAI_API_KEY,
});

// Step 2: Create the State Graph Nodes

// Node 1: Analyze the question
async function analyzeQuestion(state) {
  const userMessage = state.messages[state.messages.length - 1].content;
  console.log("Analyzing question:", userMessage);

  // Check if it's a math question or a general question
  const isMath =
    /\d+\s*[\+\-\*\/]\s*\d+/.test(userMessage) ||
    userMessage.toLowerCase().includes("calculate") ||
    userMessage.toLowerCase().includes("math");

  console.log(`Question type: ${isMath ? "MATH" : "GENERAL"}`);

  return {
    messages: state.messages,
    questionType: isMath ? "math" : "general",
  };
}

// Node 2: Handle math questions
async function handleMath(state) {
  console.log("Processing math question...");

  const userMessage = state.messages[state.messages.length - 1].content;

  // Create messages array with system message for context
  const messages = [
    new SystemMessage(
      "You are a math expert. Solve problems step by step with clear explanations."
    ),
    new HumanMessage(userMessage),
  ];

  const response = await llm.invoke(messages); // Returns AIMessage

  console.log("Math solution ready");

  return {
    messages: [...state.messages, response],
  };
}

// Node 3: Handle general questions
async function handleGeneral(state) {
  console.log("Processing general question...");

  const userMessage = state.messages[state.messages.length - 1].content;

  // Create messages array with system message for context
  const messages = [
    new SystemMessage(
      "You are a helpful and friendly assistant. Provide clear and concise answers."
    ),
    new HumanMessage(userMessage),
  ];

  const response = await llm.invoke(messages); // Returns AIMessage

  console.log("General response ready");
  return {
    messages: [...state.messages, response],
  };
}

// Router (Conditional Logic): Decide which node to call next
function routeQuestion(state) {
  console.log(
    `Routing to: ${
      state.questionType === "math" ? "MATH handler" : "GENERAL handler"
    }`
  );

  if (state.questionType === "math") {
    return "handleMath";
  }
  return "handleGeneral";
}

// Step 3: Build the advanced workflow & compile it
const advancedWorkflow = new StateGraph(MessagesAnnotation)
  // Add nodes to the graph
  .addNode("analyzeQuestion", analyzeQuestion)
  .addNode("handleMath", handleMath)
  .addNode("handleGeneral", handleGeneral)
  // Add edges to the graph
  .addEdge(START, "analyzeQuestion")
  .addConditionalEdges("analyzeQuestion", routeQuestion, {
    handleMath: "handleMath",
    handleGeneral: "handleGeneral",
  })
  .addEdge("handleMath", END)
  .addEdge("handleGeneral", END);

// Compile the workflow
const advancedGraph = advancedWorkflow.compile();

// Step 4: Run the workflow
async function runAdvancedExample() {
  // Test 1: Math question
  console.log("\nTest 1: Math Question");
  console.log("-".repeat(50));
  let result = await advancedGraph.invoke({
    messages: [new HumanMessage("What is 15 * 4?")],
  });
  console.log("Answer:", result.messages[result.messages.length - 1].content);

  // Test 2: General question
  console.log("\nTest 2: General Question");
  console.log("-".repeat(50));
  result = await advancedGraph.invoke({
    messages: [new HumanMessage("What is the capital of India?")],
  });
  console.log("Answer:", result.messages[result.messages.length - 1].content);
}

runAdvancedExample();
