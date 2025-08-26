import "dotenv/config";
import { Agent, Runner, tool } from "@openai/agents";
import chalk from "chalk";
import { z } from "zod";
import axios from "axios";

// Create a simple storytelling agent
const storytellerAgent = new Agent({
  name: "Storyteller",
  instructions:
    "You are a storyteller. You will be given a topic and you will tell a story about it. Make it engaging and interesting. and give short and concise story.",
});

// Create the weather tool
const weatherTool = tool({
  name: "get_weather",
  description: "Get the current weather for a given city.",
  parameters: z.object({
    city: z.string().describe("The city to get the weather for."),
  }),
  execute: async ({ city }) => {
    const url = `https://wttr.in/${city.toLowerCase()}?format=%C+%t`;
    const { data } = await axios.get(url, { responseType: "text" });
    return `The current weather in ${city} is ${data}`;
  },
});

// Add the weather tool to the agent
const weatherAgent = new Agent({
  name: "Weather Agent",
  tools: [weatherTool],
  instructions:
    "You are a weather assistant. You can provide the current weather for a given city using the get_weather tool.",
});

// Create a runner to run the agent
const runner = new Runner({
  model: "gpt-4o-mini",
});

// Main function to run the agent with streaming enabled
const init = async () => {
  console.log(chalk.bgCyan("  ● Story teller streaming  \n"));

  // Run the agent with streaming enabled
  const storytellerStream = await runner.run(
    storytellerAgent,
    "Tell me a story about a manoj nishad (he is a software engineer).",
    {
      stream: true, // Enable streaming
    }
  );

  // If you only care about the text you can use the transformed textStream
  storytellerStream
    .toTextStream({
      compatibleWithNodeStreams: true,
    })
    .pipe(process.stdout);

  // waiting to make sure that we are done with handling the stream
  await storytellerStream.completed;

  console.log(chalk.bgCyan("\n\n  ● Weather streaming  \n"));

  const weatherStream = await runner.run(
    weatherAgent,
    "What is the weather in Bangalore?",
    {
      stream: true, // Enable streaming
    }
  );

  weatherStream
    .toTextStream({
      compatibleWithNodeStreams: true,
    })
    .pipe(process.stdout);

  await weatherStream.completed;
};

init().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});

// Check Video for output and this is in this folder: agents-sdk-openai
