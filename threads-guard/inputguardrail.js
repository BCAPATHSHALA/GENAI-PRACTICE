import "dotenv/config";
import { Agent, run } from "@openai/agents";
import z from "zod";

// Input Guardrails Agent
const guardrailMathCheckAgent = new Agent({
  name: "Guardrail Math Agent",
  instructions: "Check if the user is asking you to do their math homework.",
  outputType: z.object({
    isMathHomework: z
      .boolean()
      .describe("Set this to true if its a math homework"),
  }),
});

const checkMathInput = {
  name: "Guardrails Math Input",
  execute: async ({ input }) => {
    const result = await run(guardrailMathCheckAgent, input);
    console.log(`😭: Use is asking ${input}`);
    return {
      tripwireTriggered: result.finalOutput.isMathHomework ? true : false,
    };
  },
};

// Customer Support Agent
const customerSupportAgent = new Agent({
  name: "Customer supporter",
  instructions: "You are a helpful customer supporter",
  inputGuardrails: [checkMathInput],
});

const chatWithAgent = async (userQuery) => {
  const result = await run(customerSupportAgent, userQuery);
  console.log(result.finalOutput);
};

chatWithAgent("i want to know about you and your company");

/*
User Query:
hi my name is manoj

Expected Output:
😭: Use is asking hi my name is manoj
Hello Manoj! 👋 How can I assist you today?

User Query:
Add two number 4 and 5

Expected Error (this error occurs becuase i am asking about math quetion to the customer agent)
😭: Use is asking Add two number 4 and 5
Unhandled rejection InputGuardrailTripwireTriggered [Error]: Input guardrail triggered: undefined
    at #runInputGuardrails (file:///E:/DEV%20ECOSYSTEM/GENAI%20PROJECTS/genai%20practice/node_modules/.pnpm/@openai+agents-core@0.0.17_ws@8.18.3_zod@3.25.76/node_modules/@openai/agents-core/dist/run.mjs:247:31)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async file:///E:/DEV%20ECOSYSTEM/GENAI%20PROJECTS/genai%20practice/node_modules/.pnpm/@openai+agents-core@0.0.17_ws@8.18.3_zod@3.25.76/node_modules/@openai/agents-core/dist/run.mjs:139:29
    at async file:///E:/DEV%20ECOSYSTEM/GENAI%20PROJECTS/genai%20practice/node_modules/.pnpm/@openai+agents-core@0.0.17_ws@8.18.3_zod@3.25.76/node_modules/@openai/agents-core/dist/tracing/context.mjs:45:24
    at async run (file:///E:/DEV%20ECOSYSTEM/GENAI%20PROJECTS/genai%20practice/node_modules/.pnpm/@openai+agents-core@0.0.17_ws@8.18.3_zod@3.25.76/node_modules/@openai/agents-core/dist/run.mjs:546:16)
    at async chatWithAgent (file:///E:/DEV%20ECOSYSTEM/GENAI%20PROJECTS/genai%20practice/threads-guard/guardrail.js:35:18) {
  state: RunState {
    _currentTurn: 1,
    _currentAgent: Agent {
      eventEmitter: [EventEmitter],
      name: 'Customer supporter',
      instructions: 'You are a helpful customer supporter',
      prompt: undefined,
      handoffDescription: '',
      handoffs: [],
      model: '',
      modelSettings: {},
      tools: [],
      mcpServers: [],
      inputGuardrails: [Array],
      outputGuardrails: [],
      outputType: 'text',
      toolUseBehavior: 'run_llm_again',
      resetToolChoice: true
    },
    _originalInput: 'Add two number 4 and 5',
    _modelResponses: [],
    _currentAgentSpan: Span { type: 'trace.span' },
    _context: RunContext { context: {}, usage: [Usage] },
    _toolUseTracker: AgentToolUseTracker {},
    _generatedItems: [],
    _maxTurns: 10,
    _noActiveAgentRun: true,
    _lastTurnResponse: undefined,
    _inputGuardrailResults: [],
    _outputGuardrailResults: [],
    _currentStep: { type: 'next_step_run_again' },
    _lastProcessedResponse: undefined,
    _trace: Trace {
      type: 'trace',
      traceId: 'trace_f3a827a1126d48fbb76a288c87ce875b',
      name: 'Agent workflow',
      groupId: null,
      metadata: {}
    }
  },
  result: {
    guardrail: { type: 'input', name: 'Guardrails Math Input' },
    output: { tripwireTriggered: true }
  }
} Promise {
  <rejected> InputGuardrailTripwireTriggered [Error]: Input guardrail triggered: undefined
      at #runInputGuardrails (file:///E:/DEV%20ECOSYSTEM/GENAI%20PROJECTS/genai%20practice/node_modules/.pnpm/@openai+agents-core@0.0.17_ws@8.18.3_zod@3.25.76/node_modules/@openai/agents-core/dist/run.mjs:247:31)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async file:///E:/DEV%20ECOSYSTEM/GENAI%20PROJECTS/genai%20practice/node_modules/.pnpm/@openai+agents-core@0.0.17_ws@8.18.3_zod@3.25.76/node_modules/@openai/agents-core/dist/run.mjs:139:29
      at async file:///E:/DEV%20ECOSYSTEM/GENAI%20PROJECTS/genai%20practice/node_modules/.pnpm/@openai+agents-core@0.0.17_ws@8.18.3_zod@3.25.76/node_modules/@openai/agents-core/dist/tracing/context.mjs:45:24
      at async run (file:///E:/DEV%20ECOSYSTEM/GENAI%20PROJECTS/genai%20practice/node_modules/.pnpm/@openai+agents-core@0.0.17_ws@8.18.3_zod@3.25.76/node_modules/@openai/agents-core/dist/run.mjs:546:16)
      at async chatWithAgent (file:///E:/DEV%20ECOSYSTEM/GENAI%20PROJECTS/genai%20practice/threads-guard/guardrail.js:35:18) {
    state: RunState {
      _currentTurn: 1,
      _currentAgent: [Agent],
      _originalInput: 'Add two number 4 and 5',
      _modelResponses: [],
      _currentAgentSpan: [Span],
      _context: [RunContext],
      _toolUseTracker: AgentToolUseTracker {},
      _generatedItems: [],
      _maxTurns: 10,
      _noActiveAgentRun: true,
      _lastTurnResponse: undefined,
      _inputGuardrailResults: [],
      _outputGuardrailResults: [],
      _currentStep: [Object],
      _lastProcessedResponse: undefined,
      _trace: [Trace]
    },
    result: { guardrail: [Object], output: [Object] }
  }
}

User Query:
i want to know about you and your company

Expected Output:
😭: Use is asking i want to know about you and your company
Thanks for your interest! I’m ChatGPT, an AI developed by OpenAI to assist users with information, problem-solving, and various tasks.

**About Me:**
- **Role:** Virtual assistant powered by artificial intelligence
- **Capabilities:** I can answer questions, help draft messages or emails, solve coding issues, explain concepts, generate ideas, and much more.
- **Availability:** 24/7, accessible online via chat.

**About OpenAI (the company that created me):**
- **Founded:** 2015
- **Headquarters:** San Francisco, California, USA
- **Focus:** Developing safe and beneficial artificial intelligence
- **Mission:** Ensure that artificial general intelligence (AGI) benefits all of humanity.
- **Key Products:** ChatGPT, DALL-E, Codex, and more.

If you have a specific company in mind (like the website or service you’re currently visiting), please let me know its name, and I can provide details about that company!
*/
