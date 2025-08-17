import "dotenv/config";
import { OpenAI } from "openai";
import axios from "axios";

// Tool 1: fetch real time weather based on city name
async function getWeatherDetailsByCity(cityname = "") {
  const url = `https://wttr.in/${cityname.toLowerCase()}?format=%C+%t`;
  const { data } = await axios.get(url, { responseType: "text" });
  return `The current weather of ${cityname} is ${data}`;
}

// We stores the all tools for calling by ai
const TOOL_MAP = {
  getWeatherDetailsByCity: getWeatherDetailsByCity,
};

const client = new OpenAI();

async function main() {
  // Chain Of Thought Prompting
  const SYSTEM_PROMPT = `
    You are an AI assistant who works on START, THINK, OBSERVE, TOOL and OUTPUT format.
    For a given user query first think and breakdown the problem into sub problems.
    You should always keep thinking and thinking before giving the actual output.
    
    Also, before outputing the final result to user you must check once if everything is correct.
    You also have list of available tools that you can call based on user query.
    
    For every tool call that you make, wait for the OBSERVATION from the tool which is the
    response from the tool that you called.

    Available Tools:
    - getWeatherDetailsByCity(cityname: string): Returns the current weather data of the city.

    Rules:
    - Strictly follow the output JSON format
    - Always follow the output in sequence that is START, THINK, OBSERVE and OUTPUT.
    - Always perform only one step at a time and wait for other step.
    - Alway make sure to do multiple steps of thinking before giving out output.
    - For every tool call always wait for the OBSERVE which contains the output from TOOL

    Output JSON Format:
    { "step": "START | THINK | OUTPUT | OBSERVE | TOOL" , "content": "string", "tool_name": "string", "input": "string" }

    Example:
    User: Hey, can you tell me weather of Patiala?
    ASSISTANT: { "step": "START", "content": "The user is intertested in the current weather details about Patiala" } 
    ASSISTANT: { "step": "THINK", "content": "Let me see if there is any available tool for this query" } 
    ASSISTANT: { "step": "THINK", "content": "I see that there is a tool available getWeatherDetailsByCity which returns current weather data" } 
    ASSISTANT: { "step": "THINK", "content": "I need to call getWeatherDetailsByCity for city patiala to get weather details" }
    ASSISTANT: { "step": "TOOL", "input": "patiala", "tool_name": "getWeatherDetailsByCity" }
    DEVELOPER: { "step": "OBSERVE", "content": "The weather of patiala is cloudy with 27 Cel" }
    ASSISTANT: { "step": "THINK", "content": "Great, I got the weather details of Patiala" }
    ASSISTANT: { "step": "OUTPUT", "content": "The weather in Patiala is 27 C with little cloud. Please make sure to carry an umbrella with you. ☔️" }
  `;

  const messages = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    {
      role: "user",
      content: "what is the current weather of delhi?",
    },
  ];

  while (true) {
    const response = await client.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: messages,
    });

    const rawContent = response.choices[0].message.content;
    const parsedContent = JSON.parse(rawContent);
    console.log(parsedContent);

    messages.push({
      role: "assistant",
      content: JSON.stringify(parsedContent),
    });

    if (parsedContent.step === "START") {
      console.log(`🔥`, parsedContent.content);
      continue;
    }

    if (parsedContent.step === "THINK") {
      console.log(`\t🧠`, parsedContent.content);
      continue;
    }

    if (parsedContent.step === "TOOL") {
      const toolToCall = parsedContent.tool_name;
      if (!TOOL_MAP[toolToCall]) {
        messages.push({
          role: "developer",
          content: `There is no such tool as ${toolToCall}`,
        });
        continue;
      }

      const responseFromTool = await TOOL_MAP[toolToCall](parsedContent.input);
      console.log(
        `🛠️: ${toolToCall}(${parsedContent.input}) = `,
        responseFromTool
      );
      messages.push({
        role: "developer",
        content: JSON.stringify({ step: "OBSERVE", content: responseFromTool }),
      });
      continue;
    }

    if (parsedContent.step === "OUTPUT") {
      console.log(`🤖`, parsedContent.content);
      break;
    }
  }

  console.log("Done...");
}

main();

/*
PS E:\DEV ECOSYSTEM\GENAI PROJECTS\genai practice> node agents.js
{
  step: 'START',
  content: 'The user is interested in knowing the current weather details of Delhi.'
}
🔥 The user is interested in knowing the current weather details of Delhi.
{
  step: 'THINK',
{
  step: 'START',
  content: 'The user is interested in knowing the current weather details of Delhi.'
}
🔥 The user is interested in knowing the current weather details of Delhi.
{
  content: 'The user is interested in knowing the current weather details of Delhi.'
}
🔥 The user is interested in knowing the current weather details of Delhi.
{
{
  step: 'THINK',
  content: 'Let me check if there is a tool available to get weather details by city.'
}
        🧠 Let me check if there is a tool available to get weather details by city.
{
  step: 'THINK',
  content: 'There is a tool called getWeatherDetailsByCity that provides current weather data for a specified city.'
}
        🧠 There is a tool called getWeatherDetailsByCity that provides current weather data for a specified city.
{
  step: 'THINK',
  content: "I should now call the getWeatherDetailsByCity tool with 'Delhi' as the input to retrieve the current weather details."
}
        🧠 I should now call the getWeatherDetailsByCity tool with 'Delhi' as the input to retrieve the current weather details.
{ step: 'TOOL', input: 'delhi', tool_name: 'getWeatherDetailsByCity' }
🛠️: getWeatherDetailsByCity(delhi) =  The current weather of delhi is Mist +28°C
{
  step: 'THINK',
  content: 'The weather details for Delhi indicate mist with a temperature of 28°C. I will now prepare the final response for the user.'
}
        🧠 The weather details for Delhi indicate mist with a temperature of 28°C. I will now prepare the final response for the user.
{
  step: 'OUTPUT',
  content: 'The current weather in Delhi is misty with a temperature of 28°C.'
}
🤖 The current weather in Delhi is misty with a temperature of 28°C.
Done...
*/
